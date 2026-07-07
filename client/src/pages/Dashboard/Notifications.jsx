import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { FiBell, FiTrash2, FiCheck, FiMail, FiHome, FiSettings, FiActivity } from 'react-icons/fi';

const Notifications = () => {
  const { notifications, fetchNotifications, markNotificationsRead, loading } = useContext(AuthContext);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markNotificationsRead();
      toast.success('All notifications marked as read.');
    } catch (err) {
      toast.error('Failed to mark notifications read');
    }
  };

  const handleDeleteNotification = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await api.delete(`/notifications/${id}`);
      if (res.data.success) {
        toast.success('Notification removed');
        fetchNotifications(); // reload
      }
    } catch (err) {
      toast.error('Failed to remove notification');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'message':
        return <FiMail className="text-info" size={18} />;
      case 'property_approval':
        return <FiHome className="text-success" size={18} />;
      case 'booking_request':
      case 'booking_status':
        return <FiActivity className="text-warning" size={18} />;
      default:
        return <FiBell className="text-primary" size={18} />;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="fade-in-up">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold m-0">My Notifications</h3>
          <p className="text-secondary m-0 mt-1">Alerts regarding approval statuses, bookings, and new chat messages.</p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <button
            className="btn btn-outline-primary btn-sm rounded-3 d-flex align-items-center gap-1.5 px-3 py-2 fw-semibold"
            onClick={handleMarkAllRead}
          >
            <FiCheck size={16} />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card border-0 glass-card p-5 text-center d-flex flex-column align-items-center justify-content-center">
          <FiBell size={48} className="text-muted mb-3" />
          <h5>Clear Inbox!</h5>
          <p className="text-secondary max-w-sm">You do not have any notification alerts at this time.</p>
        </div>
      ) : (
        <div className="card border-0 glass-card p-3 d-flex flex-column gap-2">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-3 rounded-3 d-flex align-items-start justify-content-between gap-3 border transition ${
                n.isRead ? 'bg-light border-light opacity-75' : 'bg-white border-primary-subtle shadow-sm'
              }`}
              style={{ transition: 'all 0.3s ease' }}
            >
              <div className="d-flex gap-3">
                <div className="bg-light p-2.5 rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center">
                  {getIcon(n.type)}
                </div>
                <div>
                  <h6 className={`m-0 text-sm ${n.isRead ? 'text-secondary fw-semibold' : 'text-dark fw-bold'}`}>
                    {n.title}
                  </h6>
                  <p className="text-secondary text-sm m-0 mt-1">{n.message}</p>
                  {n.link && (
                    <Link to={n.link} className="text-xs text-primary fw-semibold mt-2.5 d-inline-block text-decoration-none">
                      View Action Page &rarr;
                    </Link>
                  )}
                  <small className="text-muted d-block mt-1" style={{ fontSize: '0.7rem' }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>

              <button
                className="btn btn-sm btn-light border p-2 rounded-3 text-danger flex-shrink-0"
                title="Remove alert"
                onClick={(e) => handleDeleteNotification(n._id, e)}
              >
                <FiTrash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
