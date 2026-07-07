import React from 'react';

const LoadingSpinner = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div
        className="d-flex align-items-center justify-content-center position-fixed w-100 h-100 top-0 start-0"
        style={{
          backgroundColor: 'var(--bg-primary)',
          zIndex: 9999,
          backdropFilter: 'blur(4px)',
        }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3.5rem', height: '3.5rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 fw-semibold text-gradient fs-5 animate-pulse">Finding your perfect home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center py-5 w-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
