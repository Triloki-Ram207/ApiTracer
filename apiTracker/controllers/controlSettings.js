import ControlSettings from '../models/controls.js';

// 🛠️ Helper: Send consistent responses
const sendResponse = (res, status, success, dataOrMessage) => {
  const payload = success
    ? { success, data: dataOrMessage }
    : { success, message: dataOrMessage };
  res.status(status).json(payload);
};

// 🔄 Create or update control settings for an endpoint
export const upsertControlSettings = async (req, res) => {
  const {
    endpoint,
    api,
    tracer,
    limit,
    schedule,
    startTime,
    endTime,
    requestCount,
    rateUnit
  } = req.body;

  if (typeof endpoint !== 'string' || endpoint.trim() === '') {
    return sendResponse(res, 400, false, 'Valid endpoint is required.');
  }

  const normalizedEndpoint = endpoint.trim().toLowerCase().replace(/\/$/, '');

  try {
    const updated = await ControlSettings.findOneAndUpdate(
      { endpoint: normalizedEndpoint },
      {
        api,
        tracer,
        limit,
        schedule,
        startTime,
        endTime,
        requestCount,
        rateUnit
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    sendResponse(res, 200, true, updated);
  } catch (err) {
    console.error(`❌ Error saving control for ${normalizedEndpoint}:`, err);
    sendResponse(res, 500, false, 'Internal server error.');
  }
};

// 📊 Get all control settings (for dashboard display)
export const getAllControls = async (req, res) => {
  try {
    const controls = await ControlSettings.find().lean();
    sendResponse(res, 200, true, controls);
  } catch (err) {
    console.error('❌ Failed to fetch controls:', err);
    sendResponse(res, 500, false, 'Failed to fetch controls.');
  }
};

// ✅ Check control status for middleware logic
export const checkControlStatus = async (req, res) => {
  const { endpoint } = req.query;
  console.log('Endpoint:', endpoint);


  if (!endpoint) {
    return sendResponse(res, 400, false, 'Endpoint query parameter is required.');
  }

  const normalizedEndpoint = endpoint.trim().toLowerCase().replace(/\/$/, '');

  try {
    const control = await ControlSettings.findOne({ endpoint: normalizedEndpoint }).lean();
    console.log('Control:', control);
    if (!control) {
      return sendResponse(res, 201, true, {
        exists: false,
        api: false,
        tracer: false,
        limit: false,
        requestCount: 0,
        rateUnit: 'sec',
        schedule: false,
        startTime: '',
        endTime: ''
      });
    }

    sendResponse(res, 200, true, {
      exists: true,
      api: control.api === true,
      tracer: control.tracer === true,
      limit: control.limit === true,
      requestCount: control.requestCount || 0,
      rateUnit: control.rateUnit || 'sec',
      schedule: control.schedule === true,
      startTime: control.startTime || '',
      endTime: control.endTime || ''
    });
  } catch (err) {
    console.error(`❌ Error checking control status for ${normalizedEndpoint}:`, err);
    sendResponse(res, 500, false, 'Internal server error.');
  }
};

// 🔍 Get full control settings for modal pre-fill
export const getControlByEndpoint = async (req, res) => {
  const { endpoint } = req.query;

  if (!endpoint) {
    return sendResponse(res, 400, false, 'Endpoint query parameter is required.');
  }

  const normalizedEndpoint = endpoint.trim().toLowerCase().replace(/\/$/, '');

  try {
    const control = await ControlSettings.findOne({ endpoint: normalizedEndpoint }).lean();

    if (!control) {
      return sendResponse(res, 404, false, 'Control not found.');
    }

    sendResponse(res, 200, true, control);
  } catch (err) {
    console.error(`❌ Error fetching control for ${normalizedEndpoint}:`, err);
    sendResponse(res, 500, false, 'Internal server error.');
  }
};
