import React, { useState, useEffect } from 'react';
import '../cssFiles/Status.css';
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdOutlineCancel } from "react-icons/md";
import { FcNext, FcPrevious } from "react-icons/fc";

function Status({ data }) {
  const months = [
    'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025',
    'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025',
    'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025'
  ];

  const getInitialIndex = () => {
    const savedMonth = localStorage.getItem('selectedMonth');
    if (savedMonth) {
      const savedIndex = months.findIndex(m => m === savedMonth);
      if (savedIndex >= 0) return savedIndex;
    }

    const now = new Date();
    const currentLabel = now.toLocaleString('default', { month: 'short' }) + ' ' + now.getFullYear();
    const currentIndex = months.findIndex(m => m === currentLabel);
    return currentIndex >= 0 ? currentIndex : 0;
  };

  const [currentIndex, setCurrentIndex] = useState(getInitialIndex);
  const [endpointPages, setEndpointPages] = useState({});

  useEffect(() => {
    localStorage.setItem('selectedMonth', months[currentIndex]);
  }, [currentIndex]);

  const getStatusColor = (code) => {
    if (code === 200) return 'green';
    if (code >= 400 && code <= 599) return 'red';
    if (code >= 300 && code <= 399) return 'orange';
    if (code >= 100 && code <= 199) return 'yellow';
    return 'gray';
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < months.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePageChange = (endpoint, direction) => {
    setEndpointPages(prev => {
      const current = prev[endpoint] || 1;
      const next = direction === 'next' ? current + 1 : current - 1;
      return { ...prev, [endpoint]: next };
    });
  };

  const getPaginatedLogs = (endpoint, logs) => {
    const page = endpointPages[endpoint] || 1;
    const start = (page - 1) * 18;
    const end = start + 18;
    return logs.slice(start, end);
  };

  const selectedMonth = months[currentIndex];
  const monthData = data?.[selectedMonth] || {};

  return (
    <div className='status-wrapper'>
      <h1 className='title'>Home</h1>
      <div className='status-header'>
        <h3 className='title'>System status</h3>
        <div className="month-pagination">
          <button onClick={handlePrev} disabled={currentIndex === 0}>
            <FcPrevious />
          </button>
          <p>{selectedMonth}</p>
          <button onClick={handleNext} disabled={currentIndex === months.length - 1}>
            <FcNext />
          </button>
        </div>
      </div>

      <div className='status-container'>
        {Object.keys(monthData).length === 0 ? (
          <p className="empty-month">No logs available for {selectedMonth}</p>
        ) : (
          Object.entries(monthData).map(([endpoint, logs]) => {
            const paginatedLogs = getPaginatedLogs(endpoint, logs);
            const currentPage = endpointPages[endpoint] || 1;
            const totalPages = Math.ceil(logs.length / 18);

            return (
              <div key={endpoint} className='endpoint-block'>
                <h3>{endpoint}</h3>
                <div className='status-items'>
                  {paginatedLogs.map((log, index) => {
                    const color = getStatusColor(log.statusCode);
                    const isLast = index === paginatedLogs.length - 1;
                    const isSuccess = log.statusCode === 200;

                    return (
                      <div key={log._id || index}>
                        {isLast && (
                          isSuccess
                            ? <FaRegCircleCheck className='icon' fontSize={18} color='green' />
                            : <MdOutlineCancel className='icon' fontSize={18} color='red' />
                        )}
                        <div className='status' style={{ backgroundColor: color }}></div>
                      </div>
                    );
                  })}
                </div>

                {logs.length > 18 && (
                  <div className="endpoint-pagination">
                    <button
                      onClick={() => handlePageChange(endpoint, 'prev')}
                      disabled={currentPage === 1}
                    >
                      <FcPrevious />
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                      onClick={() => handlePageChange(endpoint, 'next')}
                      disabled={currentPage === totalPages}
                    >
                      <FcNext />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Status;
