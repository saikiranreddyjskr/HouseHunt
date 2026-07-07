import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiHome } from 'react-icons/fi';

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect away
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || (user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res && res.success) {
      toast.success('Welcome back to HouseHunt!');
      // Navigate is triggered automatically by useEffect above
    } else {
      toast.error(res?.message || 'Login failed. Please verify credentials.');
    }
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center fade-in-up" style={{ minHeight: '80vh', marginTop: '80px' }}>
      <div className="card border-0 glass-card p-4 w-100" style={{ maxWidth: '450px' }}>
        <div className="text-center mb-4">
          <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 mb-2 text-gradient">
            <FiHome size={28} style={{ color: 'var(--primary)' }} />
            <span className="fw-bold fs-3">HouseHunt</span>
          </Link>
          <h4 className="fw-bold mt-2">Log In to Your Account</h4>
          <p className="text-muted text-sm">Welcome back! Please enter your details below.</p>
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

          <div>
            <div className="d-flex align-items-center justify-content-between mb-1">
              <label className="form-label text-sm fw-semibold text-secondary m-0">Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.82rem', fontWeight: 500 }} className="text-primary text-decoration-none">
                Forgot Password?
              </Link>
            </div>
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

          <button type="submit" className="btn btn-gradient-primary rounded-3 py-2.5 fw-bold mt-2" disabled={loading}>
            {loading ? 'Logging you in...' : 'Log In'}
          </button>

          <p className="text-center text-sm text-secondary m-0 mt-2">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary text-decoration-none fw-semibold">
              Register Here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
