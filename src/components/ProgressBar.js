// components/ProgressBar.js
import React from 'react';

function ProgressBar({ savedAmount, targetAmount }) {
  const percentage = Math.min(100, (savedAmount / targetAmount) * 100);

  return (
    <div className="progress-bar-container">
      <div 
        className="progress-bar-fill"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}

export default ProgressBar;