import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLock, FiHome } from 'react-icons/fi';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.warning('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Password reset successful! You can now log in.');
      navigate('/login');
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
          <h4 className="fw-bold mt-2">Enter New Password</h4>
          <p className="text-muted text-sm">Please type your new strong password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label text-sm fw-semibold text-secondary">New Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><FiLock className="text-muted" /></span>
              <input
                type="password"
                className="form-control"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label text-sm fw-semibold text-secondary">Confirm New Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><FiLock className="text-muted" /></span>
              <input
                type="password"
                className="form-control"
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-gradient-primary rounded-3 py-2.5 fw-bold mt-2" disabled={loading}>
            {loading ? 'Resetting password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
