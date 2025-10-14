import TracerLog from '../models/tracerlogs.js';
import { calculateMetrics } from '../utils/metrics.js';

export const logData = async (req, res) => {
  try {
    const logs = await TracerLog.find().lean(); // ⚡ lean for performance

    const endpointLogs = {};
    const dateLogs = {};
    const monthlyLogs = {};
    const uptimeData = [];

    const monthMap = {
      '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
      '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
      '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
    };

    const currentYear = new Date().getFullYear();

    // Pre-fill monthlyLogs for current year
    for (let m = 1; m <= 12; m++) {
      const key = `${monthMap[String(m).padStart(2, '0')]} ${currentYear}`;
      monthlyLogs[key] = {};
    }

    for (const log of logs) {
      const { endpoint, timestamp, statusCode } = log;
      if (!endpoint || !timestamp) continue;

      // 🔁 Group by endpoint
      if (!endpointLogs[endpoint]) endpointLogs[endpoint] = [];
      endpointLogs[endpoint].push(log);

      // 📅 Group by date
      const date = new Date(timestamp).toISOString().split('T')[0];
      if (!dateLogs[date]) dateLogs[date] = [];
      dateLogs[date].push(log);

      // 📆 Group by month + endpoint
      const ts = new Date(timestamp);
      const monthKey = `${monthMap[String(ts.getMonth() + 1).padStart(2, '0')]} ${ts.getFullYear()}`;
      if (!monthlyLogs[monthKey]) monthlyLogs[monthKey] = {};
      if (!monthlyLogs[monthKey][endpoint]) monthlyLogs[monthKey][endpoint] = [];
      monthlyLogs[monthKey][endpoint].push(log);
    }

    for (const date in dateLogs) {
  dateLogs[date].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

const sortedDateLogs = Object.fromEntries(
  Object.entries(dateLogs)
    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
);
 
    // 📈 Calculate uptime per month
    for (const [monthKey, endpoints] of Object.entries(monthlyLogs)) {
      let total = 0;
      let success = 0;

      for (const logs of Object.values(endpoints)) {
        total += logs.length;
        success += logs.filter(log => log.statusCode === 200).length;
      }

      const uptime = total > 0 ? parseFloat(((success / total) * 100).toFixed(1)) : 0;
      uptimeData.push({ time: monthKey, uptime });
    }

    // 📊 Sort uptimeData chronologically
    const orderedMonths = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    uptimeData.sort((a, b) =>
      orderedMonths.indexOf(a.time.split(' ')[0]) - orderedMonths.indexOf(b.time.split(' ')[0])
    );

    const metrics = await calculateMetrics();
     
    res.status(200).json({
      success: true,
      data: endpointLogs,
      logs:sortedDateLogs,
      monthlyLogs,
      metrics,
      uptimeData,
      message: 'Logs fetched successfully'
    });
  } catch (err) {
    console.error('❌ Error fetching logs:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
