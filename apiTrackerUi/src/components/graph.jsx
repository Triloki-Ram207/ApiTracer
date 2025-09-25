import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

function UptimeTrendChart({ data }) {
  const labels = data.map(point => point.time);
  const actualUptime = data.map(point => point.uptime);
  const expectedUptime = data.map(() => 99.9); // Optional baseline

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Actual Uptime',
        data: actualUptime,
        fill: true,
        borderColor: '#1e3a8a',
        backgroundColor: 'rgba(30, 58, 138, 0.2)',
        pointBackgroundColor: '#1e3a8a',
        tension: 0.4
      },
      {
        label: 'Expected Uptime',
        data: expectedUptime,
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        borderDash: [4, 4],
        pointRadius: 0,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#fff' }
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)}%`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#fff' },
        grid: { color: '#334155' }
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { color: '#fff' },
        grid: { color: '#334155' }
      }
    }
  };

  return (
    <div style={{
      backgroundColor: '#0f172a',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 0 10px rgba(0,0,0,0.3)'
    }}>
      <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Uptime Overview</h3>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default UptimeTrendChart;
