import {
  CircularProgressbar,
  buildStyles
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React from 'react';


function MetricCard({ value, text, label, subtext, color }) {
  return (
    <div style={{
      width: 140,
      margin: '1rem',
      textAlign: 'center',
      color: '#fff'
    }}>
      <CircularProgressbar
        value={Number(value)}
        strokeWidth={10}
        counterClockwise
        text={text}
        styles={buildStyles({
          pathColor: color,
          textColor: '#fff',
          trailColor: '#2f2f2f',
          backgroundColor: '#0f172a'
        })}
      />
      <div style={{ marginTop: '0.5rem' }}>
        <strong>{label}</strong>
        {subtext && (
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
}

export default MetricCard;