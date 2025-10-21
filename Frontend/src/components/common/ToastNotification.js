import React from 'react';
import { Toast } from 'react-bootstrap';

const ToastNotification = ({ show, onClose, message, title = 'Success', variant = 'success' }) => {
  // Get appropriate icon based on variant
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return '✅';
      case 'danger':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '✅';
    }
  };

  // Get background color class
  const getBgClass = () => {
    switch (variant) {
      case 'success':
        return 'success';
      case 'danger':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'success';
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: '100px', // Below navbar
        right: '20px',
        zIndex: 9999,
        maxWidth: '350px'
      }}
    >
      <Toast 
        show={show} 
        onClose={onClose} 
        delay={3000} 
        autohide
        className={`border-0 bg-${getBgClass()} text-white`}
        style={{ 
          minWidth: '300px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          borderRadius: '8px'
        }}
      >
        <Toast.Header className={`bg-${getBgClass()} text-white border-0`} style={{ borderRadius: '8px 8px 0 0' }}>
          <strong className="me-auto">
            {getIcon()} {title}
          </strong>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </Toast.Header>
        <Toast.Body style={{ padding: '1rem' }}>
          <div className="d-flex align-items-center">
            <span className="ms-2">{message}</span>
          </div>
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default ToastNotification;