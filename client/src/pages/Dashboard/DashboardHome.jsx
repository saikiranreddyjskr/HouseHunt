import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiHome, FiBookOpen, FiHeart, FiMessageSquare, FiPlusCircle, FiChevronRight } from 'react-icons/fi';

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    propertiesListed: 0,
    myBookings: 0,
    incomingRequests: 0,
    savedProperties: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [propsRes, bookingsRes, requestsRes, favRes] = await Promise.all([
          api.get(`/properties?owner=${user._id}`),
          api.get('/bookings/my-bookings'),
          api.get('/bookings/my-requests'),
          api.get('/properties/favorites/all'),
        ]);

        setStats({
          propertiesListed: propsRes.data.count || 0,
          myBookings: bookingsRes.data.count || 0,
          incomingRequests: requestsRes.data.count || 0,
          savedProperties: favRes.data.count || 0,
        });
      } catch (err) {
        console.error('Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="fade-in-up">
      <div className="mb-4">
        <h3 className="fw-bold">Welcome, {user.name}!</h3>
        <p className="text-secondary">Here is a quick summary of your rental activities on HouseHunt.</p>
      </div>

      {/* Grid of Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 glass-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <FiHome size={28} className="text-primary" />
              <span className="badge bg-light text-secondary border px-2 py-1 text-xs">Owner</span>
            </div>
            <h3 className="fw-bold mb-1">{stats.propertiesListed}</h3>
            <p className="text-secondary text-sm m-0">Properties Listed</p>
            <Link to="/dashboard/my-properties" className="text-xs text-primary fw-semibold text-decoration-none d-flex align-items-center gap-1 mt-3">
              <span>View Listings</span>
              <FiChevronRight />
            </Link>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card border-0 glass-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <FiBookOpen size={28} className="text-primary" />
              <span className="badge bg-light text-secondary border px-2 py-1 text-xs">Tenant</span>
            </div>
            <h3 className="fw-bold mb-1">{stats.myBookings}</h3>
            <p className="text-secondary text-sm m-0">My Bookings</p>
            <Link to="/dashboard/bookings" className="text-xs text-primary fw-semibold text-decoration-none d-flex align-items-center gap-1 mt-3">
              <span>View Bookings</span>
              <FiChevronRight />
            </Link>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card border-0 glass-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <FiBookOpen size={28} className="text-primary" />
              <span className="badge bg-light text-secondary border px-2 py-1 text-xs">Owner</span>
            </div>
            <h3 className="fw-bold mb-1">{stats.incomingRequests}</h3>
            <p className="text-secondary text-sm m-0">Booking Requests</p>
            <Link to="/dashboard/bookings" className="text-xs text-primary fw-semibold text-decoration-none d-flex align-items-center gap-1 mt-3">
              <span>Manage Requests</span>
              <FiChevronRight />
            </Link>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card border-0 glass-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <FiHeart size={28} className="text-primary" />
              <span className="badge bg-light text-secondary border px-2 py-1 text-xs">Saved</span>
            </div>
            <h3 className="fw-bold mb-1">{stats.savedProperties}</h3>
            <p className="text-secondary text-sm m-0">Favorites List</p>
            <Link to="/dashboard/favorites" className="text-xs text-primary fw-semibold text-decoration-none d-flex align-items-center gap-1 mt-3">
              <span>View Wishlist</span>
              <FiChevronRight />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Panels */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 glass-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FiPlusCircle className="text-primary" />
                <span>Need to Rent out a Property?</span>
              </h5>
              <p className="text-secondary text-sm lh-lg">
                Add your rental listing on HouseHunt. Specify rental deposits, bedrooms, property types, and upload images. Once approved by the administrator, your listing goes live instantly!
              </p>
            </div>
            <Link to="/dashboard/add-property" className="btn btn-primary rounded-3 py-2 fw-semibold w-100 mt-2">
              Add New Property Listing
            </Link>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 glass-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FiMessageSquare className="text-primary" />
                <span>Inbox Messages</span>
              </h5>
              <p className="text-secondary text-sm lh-lg">
                Communicate directly with landlords or prospective tenants. Ask questions, clarify lease agreements, and coordinate house visits securely through our chat module.
              </p>
            </div>
            <Link to="/dashboard/messages" className="btn btn-outline-primary rounded-3 py-2 fw-semibold w-100 mt-2">
              Open Chat Box
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
