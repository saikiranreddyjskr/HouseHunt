import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiUsers, FiHome, FiCheckSquare, FiAlertCircle, FiTrendingUp, FiArrowRight } from 'react-icons/fi';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics');
        if (res.data.success) {
          setData(res.data.analytics);
        }
      } catch (err) {
        console.error('Failed to fetch admin analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <div className="text-center py-5"><h4>Error loading analytics data.</h4></div>;

  return (
    <div className="fade-in-up">
      <div className="mb-4">
        <h3 className="fw-bold">Admin Analytics Dashboard</h3>
        <p className="text-secondary">Overall platform activities, verification backlogs, and database stats.</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4 col-sm-6 col-12">
          <div className="card border-0 glass-card p-4 h-100 bg-gradient-blue text-white" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #172554 100%)' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <FiUsers size={28} />
              <span className="text-xs opacity-75">Users</span>
            </div>
            <h3 className="fw-bold mb-1">{data.totalUsers}</h3>
            <p className="opacity-75 text-sm m-0">Total Platform Users</p>
          </div>
        </div>

        <div className="col-md-4 col-sm-6 col-12">
          <div className="card border-0 glass-card p-4 h-100" style={{ borderLeft: '4px solid var(--primary)' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <FiHome size={28} className="text-primary" />
              <span className="badge bg-light text-secondary border px-2 py-1 text-xs">Total: {data.totalProperties}</span>
            </div>
            <h3 className="fw-bold mb-1">{data.approvedListings}</h3>
            <p className="text-secondary text-sm m-0">Approved Live Properties</p>
          </div>
        </div>

        <div className="col-md-4 col-sm-6 col-12">
          <div className="card border-0 glass-card p-4 h-100" style={{ borderLeft: '4px solid var(--secondary)' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <FiAlertCircle size={28} className="text-secondary" />
              <span className="badge bg-warning-subtle text-warning border px-2.5 py-1 text-xs">Pending Review</span>
            </div>
            <h3 className="fw-bold mb-1 text-secondary">{data.pendingApprovals}</h3>
            <p className="text-secondary text-sm m-0">Pending Approvals</p>
          </div>
        </div>

        <div className="col-md-4 col-sm-6 col-12">
          <div className="card border-0 glass-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <FiCheckSquare size={28} className="text-success" />
              <span className="text-xs text-muted">Bookings</span>
            </div>
            <h3 className="fw-bold mb-1">{data.totalBookings}</h3>
            <p className="text-secondary text-sm m-0">Total Bookings Made</p>
          </div>
        </div>

        <div className="col-md-4 col-sm-6 col-12">
          <div className="card border-0 glass-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <FiTrendingUp size={28} className="text-primary" />
              <span className="text-xs text-success fw-bold">Live Value</span>
            </div>
            <h3 className="fw-bold mb-1 text-gradient">₹{data.totalRevenue.toLocaleString()}</h3>
            <p className="text-secondary text-sm m-0">Monthly Booking Rent Vol.</p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Recently Added Properties */}
        <div className="col-lg-7">
          <div className="card border-0 glass-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h5 className="fw-bold m-0">Recently Added Listings</h5>
              <Link to="/admin/properties" className="text-sm text-primary text-decoration-none fw-semibold d-flex align-items-center gap-1">
                <span>Manage</span>
                <FiArrowRight />
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table align-middle m-0">
                <thead>
                  <tr>
                    <th scope="col" className="border-0">Property</th>
                    <th scope="col" className="border-0">Owner</th>
                    <th scope="col" className="border-0">City</th>
                    <th scope="col" className="border-0">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentProperties.map((p) => (
                    <tr key={p._id} className="border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                      <td>
                        <div className="text-sm fw-bold text-truncate" style={{ maxWidth: '180px' }}>
                          {p.title}
                        </div>
                      </td>
                      <td><span className="text-secondary text-sm">{p.owner?.name.split(' ')[0]}</span></td>
                      <td><span className="text-secondary text-sm">{p.city}</span></td>
                      <td>
                        {p.approved ? (
                          <span className="badge bg-success-subtle text-success fs-9 rounded-pill">Live</span>
                        ) : (
                          <span className="badge bg-warning-subtle text-warning fs-9 rounded-pill">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recently Registered Users */}
        <div className="col-lg-5">
          <div className="card border-0 glass-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h5 className="fw-bold m-0">Recently Registered Users</h5>
              <Link to="/admin/users" className="text-sm text-primary text-decoration-none fw-semibold d-flex align-items-center gap-1">
                <span>Manage</span>
                <FiArrowRight />
              </Link>
            </div>

            <div className="d-flex flex-column gap-3">
              {data.recentUsers.map((u) => (
                <div key={u._id} className="d-flex align-items-center justify-content-between p-2 rounded bg-light" style={{ border: '1px solid var(--border-color)' }}>
                  <div>
                    <h6 className="fw-bold m-0 text-sm">{u.name}</h6>
                    <small className="text-muted text-xs">{u.email}</small>
                  </div>
                  <span className="badge bg-secondary-subtle text-secondary capitalize text-xs px-2 py-1 rounded">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
