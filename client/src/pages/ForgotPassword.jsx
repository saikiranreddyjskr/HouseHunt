import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMail, FiHome, FiArrowLeft } from 'react-icons/fi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning('Please enter your email address.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Password reset link sent to your email address (Simulated).');
      setEmail('');
    }, 1000);
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center fade-in-up" style={{ minHeight: '80vh', marginTop: '80px' }}>
      <div className="card border-0 glass-card p-4 w-100" style={{ maxWidth: '450px' }}>
        <div className="text-center mb-4">
          <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 mb-2 text-gradient">
            <FiHome size={28} style={{ color: 'var(--primary)' }} />
            <span className="fw-bold fs-3">HouseHunt</span>
          </Link>
          <h4 className="fw-bold mt-2">Reset Your Password</h4>
          <p className="text-muted text-sm">Enter your registered email below, and we'll send instructions.</p>
        </div>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label text-sm fw-semibold text-secondary">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><FiMail className="text-muted" /></span>
              <input
                type="email"
                className="form-control"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-gradient-primary rounded-3 py-2.5 fw-bold mt-2" disabled={loading}>
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </button>

          <Link to="/login" className="text-center text-sm text-primary text-decoration-none fw-semibold d-flex align-items-center justify-content-center gap-1.5 mt-2">
            <FiArrowLeft size={16} />
            <span>Back to Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
