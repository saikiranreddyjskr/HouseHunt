import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { SERVER_URL } from './utils/api';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

// User Dashboard Pages
import DashboardHome from './pages/Dashboard/DashboardHome';
import Profile from './pages/Dashboard/Profile';
import MyProperties from './pages/Dashboard/MyProperties';
import AddEditProperty from './pages/Dashboard/AddEditProperty';
import MyBookings from './pages/Dashboard/MyBookings';
import SavedProperties from './pages/Dashboard/SavedProperties';
import Messages from './pages/Dashboard/Messages';
import Notifications from './pages/Dashboard/Notifications';

// Admin Dashboard Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminProperties from './pages/Admin/AdminProperties';
import AdminBookings from './pages/Admin/AdminBookings';
import AdminSettings from './pages/Admin/AdminSettings';

import {
  FiLayout,
  FiUser,
  FiHome,
  FiPlusCircle,
  FiFileText,
  FiHeart,
  FiMessageSquare,
  FiBell,
  FiUsers,
  FiSettings,
  FiGrid,
  FiLogOut,
} from 'react-icons/fi';

// Main Public Layout Wrapper
const PublicLayout = () => {
  return (
    <div className="d-flex flex-column min-height-vh-100" style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="flex-grow-1" style={{ paddingBottom: '50px' }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

// User Dashboard Layout Wrapper
const UserDashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { label: 'Overview', path: '/dashboard', icon: <FiLayout size={18} /> },
    { label: 'My Profile', path: '/dashboard/profile', icon: <FiUser size={18} /> },
    { label: 'My Listings', path: '/dashboard/my-properties', icon: <FiHome size={18} /> },
    { label: 'Add Property', path: '/dashboard/add-property', icon: <FiPlusCircle size={18} /> },
    { label: 'My Bookings', path: '/dashboard/bookings', icon: <FiFileText size={18} /> },
    { label: 'My Wishlist', path: '/dashboard/favorites', icon: <FiHeart size={18} /> },
    { label: 'My Chats', path: '/dashboard/messages', icon: <FiMessageSquare size={18} /> },
    { label: 'Alerts', path: '/dashboard/notifications', icon: <FiBell size={18} /> },
  ];

  return (
    <div className="d-flex flex-column min-height-vh-100" style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container flex-grow-1" style={{ marginTop: '95px', paddingBottom: '60px' }}>
        <div className="row g-4">
          {/* Dashboard Sidebar */}
          <div className="col-lg-3 col-md-4">
            <div className="card border-0 glass-card p-3 d-flex flex-column gap-2" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="text-center py-3 border-bottom mb-2" style={{ borderColor: 'var(--border-color)' }}>
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold mx-auto mb-2.5"
                  style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}
                >
                  {user && user.profilePicture ? (
                      <img src={`${SERVER_URL}${user.profilePicture}`} alt="Avatar" className="rounded-circle w-100 h-100 object-fit-cover" />
                  ) : (
                    user ? user.name[0] : 'U'
                  )}
                </div>
                <h6 className="fw-bold m-0 text-dark">{user ? user.name : 'User'}</h6>
                <small className="text-muted capitalize text-xs">{user ? user.role : 'Guest'}</small>
              </div>

              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`btn text-start border-0 rounded-3 px-3 py-2.5 d-flex align-items-center gap-2.5 transition text-sm ${
                      isActive ? 'bg-primary text-white shadow-sm' : 'bg-transparent text-secondary hover-scale'
                    }`}
                  >
                    {link.icon}
                    <span className="fw-medium">{link.label}</span>
                  </Link>
                );
              })}
              <button
                className="btn text-start border-0 rounded-3 px-3 py-2.5 d-flex align-items-center gap-2.5 transition text-sm text-danger hover-scale mt-2"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                <FiLogOut size={18} />
                <span className="fw-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="col-lg-9 col-md-8">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Admin Dashboard Layout Wrapper
const AdminDashboardLayout = () => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <FiGrid size={18} /> },
    { label: 'Manage Users', path: '/admin/users', icon: <FiUsers size={18} /> },
    { label: 'Manage Listings', path: '/admin/properties', icon: <FiHome size={18} /> },
    { label: 'Manage Bookings', path: '/admin/bookings', icon: <FiFileText size={18} /> },
    { label: 'System Settings', path: '/admin/settings', icon: <FiSettings size={18} /> },
  ];

  return (
    <div className="d-flex flex-column min-height-vh-100" style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container flex-grow-1" style={{ marginTop: '95px', paddingBottom: '60px' }}>
        <div className="row g-4">
          {/* Admin Sidebar */}
          <div className="col-lg-3 col-md-4">
            <div className="card border-0 glass-card p-3 d-flex flex-column gap-2" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="text-center py-3 border-bottom mb-2" style={{ borderColor: 'var(--border-color)' }}>
                <div
                  className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold mx-auto mb-2.5"
                  style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}
                >
                  A
                </div>
                <h6 className="fw-bold m-0 text-dark">Admin Console</h6>
                <small className="text-danger fw-semibold text-xs">System Control</small>
              </div>

              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`btn text-start border-0 rounded-3 px-3 py-2.5 d-flex align-items-center gap-2.5 transition text-sm ${
                      isActive ? 'bg-primary text-white shadow-sm' : 'bg-transparent text-secondary hover-scale'
                    }`}
                  >
                    {link.icon}
                    <span className="fw-medium">{link.label}</span>
                  </Link>
                );
              })}
              <button
                className="btn text-start border-0 rounded-3 px-3 py-2.5 d-flex align-items-center gap-2.5 transition text-sm text-danger hover-scale mt-2"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                <FiLogOut size={18} />
                <span className="fw-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Admin Content */}
          <div className="col-lg-9 col-md-8">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="properties" element={<Properties />} />
            <Route path="properties/:id" element={<PropertyDetails />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Protected Registered User Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <UserDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="my-properties" element={<MyProperties />} />
            <Route path="add-property" element={<AddEditProperty />} />
            <Route path="edit-property/:id" element={<AddEditProperty />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="favorites" element={<SavedProperties />} />
            <Route path="messages" element={<Messages />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </AuthProvider>
  );
};

export default App;
