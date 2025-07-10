import React, { useState, useEffect } from 'react';
import './Toast.css';

interface ToastProps {
  id: string;
  message: string;
  onClose: (id: string) => void;
  onDontShowAgain: (message: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, onClose, onDontShowAgain }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger show animation after mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    onClose(id);
  };

  const handleDontShowAgainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setDontShowAgain(checked);
    if (checked) {
      onDontShowAgain(message);
    }
  };

  return (
    <div className={`toast ${isVisible ? 'show' : ''}`} data-toast-id={id}>
      <div className="toast-content">
        <div className="toast-message">{message}</div>
        <button 
          className="toast-close-btn" 
          onClick={handleClose}
          aria-label="Close toast"
        >
          ×
        </button>
      </div>
      <div className="toast-footer">
        <label className="toast-dont-show-again">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={handleDontShowAgainChange}
          />
          <span>Don't show again</span>
        </label>
      </div>
    </div>
  );
};

export default Toast; 