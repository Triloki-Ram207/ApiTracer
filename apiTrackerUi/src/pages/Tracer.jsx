import React, { useMemo } from 'react';
import '../cssFiles/tracer.css';

function Tracer({ data }) {

   const today = useMemo(() => new Date(), []);
   console.log("data:",data);
  const yesterday = useMemo(() => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return y;
  }, []);
  if (!data || Object.keys(data).length === 0) {
    return <p>Loading trace logs...</p>;
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const dateOnly = date.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dateOnly === todayStr) return 'Today';
    if (dateOnly === yesterdayStr) return 'Yesterday';
    return dateOnly;
  };

  return (
    <div className='tracer'>
      <h2 className='title'>API Trace Logs</h2>
      <div className='log-date-groups'>
        {Object.entries(data).map(([date, logs]) => (
          <div key={date} className='date-block'>
            <h3 className='date'>{formatDate(date)}</h3>
            <div className='log-list'>
              {Array.isArray(logs) && logs.map((log) => (
                <div key={`${log._id || 'log'}-${log.timestamp}`} className='log-item'>
                  <p><strong>TraceId:</strong> {log.traceId}</p>
                  <p><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p>
                  <p><strong>Method:</strong> {log.method}</p>
                  <p>
                    <strong>StatusCode:</strong>{' '}
                    <span style={{ color: log.statusCode >= 400 ? '#f87171' : '#34d399' }}>
                      {log.statusCode}
                    </span>
                  </p>
                  <p><strong>ResponseTime:</strong> {log.responseTime} ms</p>
                  <p><strong>Endpoint:</strong> {log.endpoint}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tracer;
