import TracerLog from '../models/tracerlogs.js';
import moment from 'moment';

export async function calculateMetrics() {
  const sevenDaysAgo = moment().subtract(7, 'days').toDate();

  // ⚡ Fetch logs from the last 7 days
  const logs = await TracerLog.find({ timestamp: { $gte: sevenDaysAgo } }).lean();
  const totalRequests = logs.length;

  if (totalRequests === 0) {
    return {
      totalRequestVolume: 0,
      averageResponseTime: '0 ms',
      uptimePercentage: '0%',
      errorRate: '0%',
      mostCommonError: 'None',
      lastDowntimeTimestamp: 'None',
      peakLatency: '0 ms',
      averageRequestsPerDay: '0.00'
    };
  }

  let successCount = 0;
  let errorCount = 0;
  let totalLatency = 0;
  let peakLatency = 0;
  const errorFrequency = {};

  for (const log of logs) {
    const { statusCode, responseTime } = log;
    totalLatency += responseTime;
    if (responseTime > peakLatency) peakLatency = responseTime;

    if (statusCode >= 200 && statusCode < 300) {
      successCount++;
    } else if (statusCode >= 400) {
      errorCount++;
      errorFrequency[statusCode] = (errorFrequency[statusCode] || 0) + 1;
    }
  }

  const mostCommonError = Object.entries(errorFrequency)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  const lastDowntimeLog = logs
    .filter(log => log.statusCode >= 400)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

  return {
    totalRequestVolume: totalRequests,
    averageResponseTime: `${(totalLatency / totalRequests).toFixed(2)}`,
    uptimePercentage: `${((successCount / totalRequests) * 100).toFixed(2)}`,
    errorRate: `${((errorCount / totalRequests) * 100).toFixed(2)}`,
    mostCommonError,
    peakLatency: `${peakLatency.toFixed(2)} ms`,
    averageRequestsPerDay: (totalRequests / 7).toFixed(2),
    lastDowntimeTimestamp: lastDowntimeLog ? lastDowntimeLog.timestamp.toISOString() : 'None'
  };
}
