import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { FiBookOpen, FiTrash2 } from 'react-icons/fi';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/admin/bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      toast.error('Failed to load platform bookings list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id, title) => {
    if (window.confirm(`Are you sure you want to cancel the booking for property "${title}"?`)) {
      try {
        const res = await api.delete(`/bookings/${id}`);
        if (res.data.success) {
          toast.success('Booking cancelled successfully.');
          fetchBookings(); // reload
        }
      } catch (err) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="fade-in-up">
      <div className="mb-4">
        <h3 className="fw-bold">Platform Bookings Audit</h3>
        <p className="text-secondary">Monitor rental leases, agreements, and cancel active contracts if required.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="card border-0 glass-card p-5 text-center d-flex flex-column align-items-center justify-content-center">
          <FiBookOpen size={48} className="text-muted mb-3" />
          <h5>No Bookings in System</h5>
          <p className="text-secondary">No tenant booking requests exist on the platform yet.</p>
        </div>
      ) : (
        <div className="card border-0 glass-card p-3 overflow-hidden">
          <div className="table-responsive">
            <table className="table align-middle m-0">
              <thead>
                <tr>
                  <th scope="col" className="border-0">Tenant Details</th>
                  <th scope="col" className="border-0">Property Context</th>
                  <th scope="col" className="border-0">Move-in Date</th>
                  <th scope="col" className="border-0">Duration</th>
                  <th scope="col" className="border-0">Lease Status</th>
                  <th scope="col" className="border-0">Payment</th>
                  <th scope="col" className="border-0 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                    <td>
                      <div className="text-sm">
                        <span className="fw-bold text-dark d-block">{b.user?.name || 'Unknown'}</span>
                        <span className="text-muted text-xs d-block">{b.user?.email}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: '180px' }}>
                        <h6 className="fw-bold m-0 text-sm text-truncate">{b.property?.title || 'Unknown Property'}</h6>
                        <small className="text-muted text-xs">Owner: {b.property?.owner?.name || 'Unknown'}</small>
                      </div>
                    </td>
                    <td><span className="text-secondary text-sm">{new Date(b.moveInDate).toLocaleDateString()}</span></td>
                    <td><span className="text-secondary text-sm">{b.duration} Months</span></td>
                    <td>
                      <span className={`badge px-2.5 py-1.5 rounded-pill fs-8 ${
                        b.status === 'Approved' ? 'bg-success-subtle text-success border border-success-subtle' :
                        b.status === 'Pending' ? 'bg-warning-subtle text-warning border border-warning-subtle' :
                        b.status === 'Rejected' ? 'bg-danger-subtle text-danger border border-danger-subtle' :
                        'bg-secondary-subtle text-secondary border border-secondary-subtle'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge px-2 py-1 rounded fs-8 ${b.paymentStatus === 'Paid' ? 'bg-success text-white' : 'bg-light text-secondary'}`}>
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center justify-content-end">
                        {['Pending', 'Approved'].includes(b.status) ? (
                          <button
                            className="btn btn-outline-danger btn-xs py-1.5 px-3 rounded-3 fw-semibold text-xs d-flex align-items-center gap-1"
                            onClick={() => handleCancel(b._id, b.property?.title)}
                          >
                            <FiTrash2 size={12} />
                            <span>Cancel Booking</span>
                          </button>
                        ) : (
                          <span className="text-muted text-xs">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
