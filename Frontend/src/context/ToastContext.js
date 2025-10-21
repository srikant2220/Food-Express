import React, { createContext, useContext, useState } from 'react';
import ToastNotification from '../components/common/ToastNotification';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, title = 'Success', variant = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, title, variant, duration, show: true };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const value = {
    showToast,
    removeToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div style={{
        position: 'fixed',
        top: '100px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {toasts.map(toast => (
          <ToastNotification
            key={toast.id}
            show={toast.show}
            onClose={() => removeToast(toast.id)}
            message={toast.message}
            title={toast.title}
            variant={toast.variant}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};