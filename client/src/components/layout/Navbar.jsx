import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { SERVER_URL } from '../../utils/api';
import {
  FiSun,
  FiMoon,
  FiUser,
  FiBell,
  FiLogOut,
  FiMenu,
  FiX,
  FiHome,
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, theme, toggleTheme, unreadNotificationsCount } = useContext(AuthContext);
  const [navExpanded, setNavExpanded] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setNavExpanded(false);
  };

  const toggleNav = () => setNavExpanded(!navExpanded);
  const closeNav = () => setNavExpanded(false);

  return (
    <nav className="navbar navbar-expand-lg fixed-top glass-navbar py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center fw-bold fs-3 text-gradient" to="/" onClick={closeNav}>
          <FiHome className="me-2" style={{ color: 'var(--primary)' }} />
          <span>HouseHunt</span>
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={toggleNav}
          aria-controls="navbarNav"
          aria-expanded={navExpanded}
          aria-label="Toggle navigation"
        >
          {navExpanded ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <div className={`collapse navbar-collapse ${navExpanded ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link px-3 fw-medium" to="/" onClick={closeNav}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 fw-medium" to="/properties" onClick={closeNav}>Properties</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 fw-medium" to="/about" onClick={closeNav}>About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 fw-medium" to="/contact" onClick={closeNav}>Contact</Link>
            </li>

            {/* Authenticated Links */}
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3 position-relative" to="/dashboard/notifications" onClick={closeNav}>
                    <FiBell size={20} />
                    {unreadNotificationsCount > 0 && (
                      <span className="position-absolute top-1 start-75 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li className="nav-item dropdown ms-lg-2">
                  <button
                    className="btn btn-outline-primary border-0 dropdown-toggle d-flex align-items-center gap-2"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user.profilePicture ? (
                      <img
                        src={`${SERVER_URL}${user.profilePicture}`}
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                      />
                    ) : (
                      <FiUser size={18} />
                    )}
                    <span>{user.name.split(' ')[0]}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 glass-card mt-2 p-2" aria-labelledby="userDropdown">
                    <li>
                      <Link
                        className="dropdown-item rounded-3 py-2 fw-medium"
                        to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                        onClick={closeNav}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item rounded-3 py-2 fw-medium" to="/dashboard/profile" onClick={closeNav}>
                        My Profile
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider my-2" style={{ borderColor: 'var(--border-color)' }} /></li>
                    <li>
                      <button className="dropdown-item rounded-3 py-2 fw-medium text-danger d-flex align-items-center gap-2 w-100" onClick={handleLogout}>
                        <FiLogOut size={16} />
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item d-flex gap-2 ms-lg-3 mt-3 mt-lg-0">
                <Link className="btn btn-outline-primary border-2 px-4 py-2 rounded-3 fw-semibold" to="/login" onClick={closeNav}>
                  Login
                </Link>
                <Link className="btn btn-gradient-primary px-4 py-2 rounded-3" to="/register" onClick={closeNav}>
                  Register
                </Link>
              </li>
            )}

            {/* Theme Toggle Button */}
            <li className="nav-item ms-lg-3 mt-3 mt-lg-0">
              <button
                className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                onClick={toggleTheme}
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
