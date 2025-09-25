import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const rateLimitStore = {};

const getWindowMs = (unit) => {
  const units = { sec: 1000, min: 60_000, hour: 3_600_000 };
  return units[unit] || 1000;
};

const isWithinSchedule = (start, end) => {
  if (!start || !end) return false;
  const now = new Date();

  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);

  const startTime = new Date(now);
  startTime.setHours(startHour, startMin, 0, 0);

  const endTime = new Date(now);
  endTime.setHours(endHour, endMin, 0, 0);

  return now >= startTime && now < endTime;
};

const tracerMiddleware = (apiKey) => {
  return async (req, res, next) => {
    const incomingKey = req.headers['x-api-key'];
    if (!incomingKey || incomingKey !== apiKey) return next();
    if (req.originalUrl === '/log') return next();

    const endpoint = req.originalUrl.toLowerCase().replace(/\/$/, '');
    const method = req.method;
    const traceId = uuidv4();
    const startTime = process.hrtime();
    const timestamp = new Date().toISOString();
    const logBuffer = [];

    let controlStatus = {};

    try {
      const resControl = await axios.get('http://localhost:4000/api/controls/check', {
        params: { endpoint },
        headers: { 'x-api-key': apiKey }
      });
      controlStatus = resControl.data.data;
      if (!controlStatus?.exists) {
  try {
    await axios.post('http://localhost:4000/api/controls', {
      endpoint,
      api: false,
      tracer: false,
      limit: false,
      schedule: false,
      startTime: '',
      endTime: '',
      requestCount: 0,
      rateUnit: 'sec'
    }, {
      headers: { 'x-api-key': apiKey }
    });

    console.log(`✅ Control entry created for ${endpoint}`);
    controlStatus = {
      exists: true,
      api: false,
      tracer: false,
      limit: false,
      schedule: false,
      startTime: '',
      endTime: '',
      requestCount: 0,
      rateUnit: 'sec'
    };
  } catch (err) {
    console.error(`❌ Failed to create control entry for ${endpoint}:`, err.message);
  }
}

      console.log("controlStatus:", controlStatus);
    } catch (err) {
      console.warn(`⚠️ Control check failed for ${endpoint}:`, err.message);
    }

    if (controlStatus?.api) {
      return res.status(404).json({ message: 'Invalid request' });
    }

    // 🚦 Rate limiting
    if (controlStatus?.limit) {
      const now = Date.now();
      const windowMs = getWindowMs(controlStatus.rateUnit);
      const store = rateLimitStore[endpoint] || { count: 0, windowStart: now };

      if (now - store.windowStart >= windowMs) {
        store.count = 0;
        store.windowStart = now;
      }

      store.count += 1;
      rateLimitStore[endpoint] = store;

      if (store.count > controlStatus.requestCount) {
        return res.status(429).json({ message: 'Rate limit exceeded. Try again later.' });
      }
    }

    // 🧠 Console hijack
    const originalConsole = {};
    ['log', 'error', 'warn', 'info'].forEach((type) => {
      originalConsole[type] = console[type];
      console[type] = (...args) => {
        logBuffer.push({
          timestamp: new Date().toISOString(),
          type: type.toUpperCase(),
          method,
          endpoint,
          message: args.map(String).join(' ')
        });
        originalConsole[type](...args);
      };
    });

    console.log('Schedule check:', {
      now: new Date().toLocaleTimeString(),
      start: controlStatus.startTime,
      end: controlStatus.endTime,
      result: isWithinSchedule(controlStatus.startTime, controlStatus.endTime)
    });

    // 📦 Hook into response
    res.on('finish', async () => {
      const [sec, nano] = process.hrtime(startTime);
      const responseTime = Math.round(sec * 1000 + nano / 1e6);
      const statusCode = res.statusCode;

      // Restore console
      Object.entries(originalConsole).forEach(([key, fn]) => {
        console[key] = fn;
      });

      const tracePayload = {
        traceId,
        timestamp,
        method,
        endpoint,
        statusCode,
        responseTime,
        logs: logBuffer
      };

      const shouldTrace =
        controlStatus?.tracer === false &&
        (!controlStatus?.schedule || isWithinSchedule(controlStatus.startTime, controlStatus.endTime));

      if (shouldTrace) {
        try {
          await axios.post('http://localhost:4000/log', tracePayload, {
            headers: {
              'x-api-key': apiKey,
              'Content-Type': 'application/json'
            }
          });
        } catch (err) {
          originalConsole.error('❌ Tracer API logging failed:', err.message);
        }
      }
    });

    next();
  };
};

export default tracerMiddleware;
