import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Status from './pages/Status.jsx';
import Tracer from './pages/Tracer.jsx';
import Analysis from './pages/Analysis.jsx';
import Configuration from './pages/Configuration.jsx';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
          const res = await axios.get(`${apiUrl}/api/logs`);
        setData(res.data);
        console.log(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch logs:', err.message);
        setError('Failed to load data');
      }
    };

    fetchData();
  }, []);

  return (
    <Routes>
      <Route path='/' element={<Home />}>
        <Route
          index
          element={
            data ? (
              <Status data={data.monthlyLogs} />
            ) : error ? (
              <p>{error}</p>
            ) : (
              <p>Loading status...</p>
            )
          }
        />
        <Route
          path='/tracker'
          element={
            data ? (
              <Tracer data={data.logs} />
            ) : error ? (
              <p>{error}</p>
            ) : (
              <p>Loading tracer...</p>
            )
          }
        />
        <Route
          path='/analysis'
          element={
            data ? (
              <Analysis metrics={data.metrics} uptimeData={data.uptimeData} />
            ) : error ? (
              <p>{error}</p>
            ) : (
              <p>Loading analysis...</p>
            )
          }
        />
        <Route
          path='/configuration'
          element={
            data ? (
              <Configuration apiData={data.data} />
            ) : error ? (
              <p>{error}</p>
            ) : (
              <p>Loading configuration...</p>
            )
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
