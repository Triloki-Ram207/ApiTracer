import React, { useMemo } from 'react';

import 'react-circular-progressbar/dist/styles.css';
import UptimeTrendChart from '../components/graph.jsx';
import '../cssFiles/analysis.css';
import MetricCard from '../components/MetricCard.jsx';

const COLORS = {
  uptime: '#00C49F',
  response: '#0088FE',
  volume: '#FFBB28',
  error: '#FF8042'
};

function Analysis({ metrics, uptimeData }) {
  const lastDowntime = useMemo(() => {
    return metrics.lastDowntimeTimestamp
      ? new Date(metrics.lastDowntimeTimestamp).toLocaleString()
      : 'N/A';
  }, [metrics.lastDowntimeTimestamp]);

  return (
    <>
      <div className="analysis-container">
        <MetricCard
          label="Uptime"
          value={metrics.uptimePercentage}
          text={`${metrics.uptimePercentage}%`}
          subtext={
            <>
              <div>(Last 7 days)</div>
              <div>Last downtime: {lastDowntime}</div>
            </>
          }
          color={COLORS.uptime}
        />
        <MetricCard
          label="Avg Response Time"
          value={metrics.averageResponseTime}
          text={`${metrics.averageResponseTime}ms`}
          subtext={
            <>
              <div>{metrics.averageResponseTime} ms</div>
              <div>Peak latency: {metrics.peakLatency} ms</div>
            </>
          }
          color={COLORS.response}
        />
        <MetricCard
          label="Request Volume"
          value={metrics.totalRequestVolume}
          text={`${metrics.totalRequestVolume}`}
          subtext={
            <>
              <div>{metrics.totalRequestVolume} requests</div>
              <div>Avg/day: {metrics.averageRequestsPerDay} reqs</div>
            </>
          }
          color={COLORS.volume}
        />
        <MetricCard
          label="Most Common Error"
          value={metrics.errorRate}
          text={`${metrics.errorRate}%`}
          subtext={`Error: ${metrics.mostCommonError}`}
          color={COLORS.error}
        />
      </div>
      <div className="chart-container">
        <UptimeTrendChart data={uptimeData} />
      </div>
    </>
  );
}

export default Analysis;
