import React, { useEffect, useState } from 'react';
import Toast from './Toast';
import './ToastContainer.css';

interface ToastItem {
  id: string;
  message: string;
}

interface ToastContainerProps {
  children?: React.ReactNode;
}

// Toast context and hook
interface ToastContextType {
  showToast: (message: string) => void;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastContainer: React.FC<ToastContainerProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [dontShowMessages, setDontShowMessages] = useState<Set<string>>(new Set());

  // Load "don't show again" messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('toast-dont-show-again');
    if (savedMessages) {
      try {
        const messages = JSON.parse(savedMessages);
        setDontShowMessages(new Set(messages));
      } catch (error) {
        console.error('Error loading toast preferences:', error);
      }
    }
  }, []);

  // Save "don't show again" messages to localStorage
  const saveDontShowMessages = (messages: Set<string>) => {
    try {
      localStorage.setItem('toast-dont-show-again', JSON.stringify(Array.from(messages)));
    } catch (error) {
      console.error('Error saving toast preferences:', error);
    }
  };

  const showToast = (message: string) => {
    // Check if this message should be shown
    if (dontShowMessages.has(message)) {
      return;
    }

    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastItem = { id, message };
    
    setToasts(prev => [...prev, newToast]);
  };

  const closeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleDontShowAgain = (message: string) => {
    const newDontShowMessages = new Set(dontShowMessages).add(message);
    setDontShowMessages(newDontShowMessages);
    saveDontShowMessages(newDontShowMessages);
  };

  const contextValue: ToastContextType = {
    showToast
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="toast-container">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="toast-wrapper"
            style={{
              transform: `translateY(${index * -8}px)`,
              zIndex: 10000 - index
            }}
          >
            <Toast
              id={toast.id}
              message={toast.message}
              onClose={closeToast}
              onDontShowAgain={handleDontShowAgain}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastContainer; 