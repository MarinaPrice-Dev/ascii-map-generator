import React from 'react';
import './Loader.css';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <div className="loader-spinner"></div>
        <span className="loader-text">{message}</span>
      </div>
    </div>
  );
};

export default Loader; 