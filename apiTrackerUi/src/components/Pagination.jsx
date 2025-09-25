import React, { useState } from 'react';
import '../cssFiles/Pagination.css'; 

const months = [
  'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025',
  'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025',
  'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025'
];

function MonthPagination() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < months.length - 1) setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="month-pagination">
      <button onClick={handlePrev} disabled={currentIndex === 0}>Previous</button>
      <p>{months[currentIndex]}</p>
      <button onClick={handleNext} disabled={currentIndex === months.length - 1}>Next</button>
    </div>
  );
}

export default MonthPagination;
