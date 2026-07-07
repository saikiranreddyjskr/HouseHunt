import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="container py-5 d-flex align-items-center justify-content-center text-center fade-in-up" style={{ minHeight: '80vh', marginTop: '80px' }}>
      <div className="card border-0 glass-card p-5 w-100" style={{ maxWidth: '550px' }}>
        <FiAlertTriangle size={64} className="text-warning mb-4 animate-bounce" />
        <h1 className="display-5 fw-bold mb-3">404 - Page Not Found</h1>
        <p className="text-secondary mb-4 leading-relaxed">
          Oops! The page you are looking for does not exist, has been removed, or is temporarily unavailable. Let us help you navigate back.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/" className="btn btn-gradient-primary rounded-3 px-4 py-2.5 fw-bold d-flex align-items-center gap-2">
            <FiHome size={18} />
            <span>Go to Homepage</span>
          </Link>
          <Link to="/properties" className="btn btn-outline-secondary rounded-3 px-4 py-2.5 fw-bold">
            Explore Properties
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
