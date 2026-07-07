import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiPhone, FiLock, FiHome } from 'react-icons/fi';

const Register = () => {
  const { register, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect away
  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, confirmPassword } = formData;

    if (!name || !email || !password) {
      toast.warning('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      toast.warning('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await register(name, email, password, phone);
    setLoading(false);

    if (res && res.success) {
      toast.success('Registration successful! Welcome to HouseHunt.');
    } else {
      toast.error(res?.message || 'Registration failed.');
    }
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center fade-in-up" style={{ minHeight: '80vh', marginTop: '80px' }}>
      <div className="card border-0 glass-card p-4 w-100" style={{ maxWidth: '500px' }}>
        <div className="text-center mb-4">
          <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 mb-2 text-gradient">
            <FiHome size={28} style={{ color: 'var(--primary)' }} />
            <span className="fw-bold fs-3">HouseHunt</span>
          </Link>
          <h4 className="fw-bold mt-2">Create an Account</h4>
          <p className="text-muted text-sm">Sign up today and start hunting or listing properties.</p>
        </div>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label text-sm fw-semibold text-secondary">Full Name *</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><FiUser className="text-muted" /></span>
              <input
                type="text"
                className="form-control"
                placeholder="John Doe"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label text-sm fw-semibold text-secondary">Email Address *</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><FiMail className="text-muted" /></span>
              <input
                type="email"
                className="form-control"
                placeholder="john@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label text-sm fw-semibold text-secondary">Phone Number</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><FiPhone className="text-muted" /></span>
              <input
                type="tel"
                className="form-control"
                placeholder="98765 43210"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label text-sm fw-semibold text-secondary">Password *</label>
              <div className="input-group">
                <span className="input-group-text bg-light"><FiLock className="text-muted" /></span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label text-sm fw-semibold text-secondary">Confirm *</label>
              <div className="input-group">
                <span className="input-group-text bg-light"><FiLock className="text-muted" /></span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-gradient-primary rounded-3 py-2.5 fw-bold mt-2" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-secondary m-0 mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-primary text-decoration-none fw-semibold">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
