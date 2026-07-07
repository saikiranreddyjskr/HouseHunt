import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { FiCheck, FiX, FiTrash2, FiBookOpen, FiAlertCircle } from 'react-icons/fi';

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('bookings'); // bookings or requests
  const [bookings, setBookings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookingsData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, requestsRes] = await Promise.all([
        api.get('/bookings/my-bookings'),
        api.get('/bookings/my-requests'),
      ]);

      if (bookingsRes.data.success) setBookings(bookingsRes.data.bookings);
      if (requestsRes.data.success) setRequests(requestsRes.data.bookings);
    } catch (err) {
      toast.error('Failed to load bookings details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingsData();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    if (window.confirm(`Are you sure you want to mark this booking request as ${status.toLowerCase()}?`)) {
      try {
        const res = await api.put(`/bookings/${id}/status`, { status });
        if (res.data.success) {
          toast.success(`Booking request was ${status.toLowerCase()} successfully!`);
          fetchBookingsData();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to update booking status');
      }
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking? This will reopen the listing if approved.')) {
      try {
        const res = await api.delete(`/bookings/${id}`);
        if (res.data.success) {
          toast.success('Booking cancelled successfully.');
          fetchBookingsData();
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
        <h3 className="fw-bold">Bookings Management</h3>
        <p className="text-secondary">Track properties you booked or manage rent requests received from other users.</p>
      </div>

      {/* Tabs Layout */}
      <ul className="nav nav-tabs mb-4 gap-2 border-bottom-0">
        <li className="nav-item">
          <button
            className={`btn rounded-3 px-4 py-2 fw-semibold ${
              activeTab === 'bookings' ? 'btn-primary' : 'btn-light border text-secondary'
            }`}
            onClick={() => setActiveTab('bookings')}
          >
            My Rental Bookings ({bookings.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn rounded-3 px-4 py-2 fw-semibold ${
              activeTab === 'requests' ? 'btn-primary' : 'btn-light border text-secondary'
            }`}
            onClick={() => setActiveTab('requests')}
          >
            Incoming Tenant Requests ({requests.length})
          </button>
        </li>
      </ul>

      {/* 1. Renter's Bookings List */}
      {activeTab === 'bookings' && (
        bookings.length === 0 ? (
          <div className="card border-0 glass-card p-5 text-center d-flex flex-column align-items-center justify-content-center">
            <FiBookOpen size={48} className="text-muted mb-3" />
            <h5>No Active Bookings</h5>
            <p className="text-secondary max-w-sm">You haven't requested any property bookings yet. Visit properties list to choose your perfect home.</p>
          </div>
        ) : (
          <div className="card border-0 glass-card p-3">
            <div className="table-responsive">
              <table className="table align-middle m-0">
                <thead>
                  <tr>
                    <th scope="col" className="border-0">Property</th>
                    <th scope="col" className="border-0">Owner Details</th>
                    <th scope="col" className="border-0">Move-in Date</th>
                    <th scope="col" className="border-0">Duration</th>
                    <th scope="col" className="border-0">Status</th>
                    <th scope="col" className="border-0">Payment</th>
                    <th scope="col" className="border-0 text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                      <td>
                        <div className="d-flex align-items-center gap-2.5">
                          <div className="rounded overflow-hidden flex-shrink-0" style={{ width: '50px', height: '38px', background: '#e2e8f0' }}>
                            <img
                              src={b.property?.images && b.property.images.length > 0 ? `http://localhost:5000${b.property.images[0]}` : 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=60&q=80'}
                              alt="Property"
                              className="w-100 h-100 object-fit-cover"
                            />
                          </div>
                          <div>
                            <h6 className="fw-bold m-0 text-sm text-truncate" style={{ maxWidth: '160px' }}>{b.property?.title || 'Unknown Property'}</h6>
                            <small className="text-muted">{b.property?.city}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <span className="fw-medium text-dark d-block">{b.property?.owner?.name || 'Unknown'}</span>
                          <span className="text-muted text-xs">{b.property?.owner?.phone || b.property?.owner?.email || ''}</span>
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
                              onClick={() => handleCancelBooking(b._id)}
                            >
                              <FiTrash2 size={12} />
                              <span>Cancel</span>
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
        )
      )}

      {/* 2. Owner's Incoming Requests List */}
      {activeTab === 'requests' && (
        requests.length === 0 ? (
          <div className="card border-0 glass-card p-5 text-center d-flex flex-column align-items-center justify-content-center">
            <FiBookOpen size={48} className="text-muted mb-3" />
            <h5>No Requests Received</h5>
            <p className="text-secondary max-w-sm">No renters have requested bookings on your listings yet. Ensure properties are approved and priced competitively.</p>
          </div>
        ) : (
          <div className="card border-0 glass-card p-3">
            <div className="table-responsive">
              <table className="table align-middle m-0">
                <thead>
                  <tr>
                    <th scope="col" className="border-0">Renter Profile</th>
                    <th scope="col" className="border-0">Property Context</th>
                    <th scope="col" className="border-0">Move-in Date</th>
                    <th scope="col" className="border-0">Duration</th>
                    <th scope="col" className="border-0">Booking Status</th>
                    <th scope="col" className="border-0 text-end">Manage Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r._id} className="border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                      <td>
                        <div className="text-sm">
                          <span className="fw-bold text-dark d-block">{r.user?.name || 'Unknown User'}</span>
                          <span className="text-muted text-xs d-block">{r.user?.email}</span>
                          {r.user?.phone && <span className="text-secondary text-xs">{r.user?.phone}</span>}
                        </div>
                      </td>
                      <td>
                        <div style={{ maxWidth: '180px' }}>
                          <h6 className="fw-bold m-0 text-sm text-truncate">{r.property?.title || 'Unknown Property'}</h6>
                          <small className="text-primary fw-medium text-xs">₹{r.property?.price.toLocaleString()}/mo</small>
                        </div>
                      </td>
                      <td><span className="text-secondary text-sm">{new Date(r.moveInDate).toLocaleDateString()}</span></td>
                      <td><span className="text-secondary text-sm">{r.duration} Months</span></td>
                      <td>
                        <span className={`badge px-2.5 py-1.5 rounded-pill fs-8 ${
                          r.status === 'Approved' ? 'bg-success-subtle text-success border border-success-subtle' :
                          r.status === 'Pending' ? 'bg-warning-subtle text-warning border border-warning-subtle' :
                          r.status === 'Rejected' ? 'bg-danger-subtle text-danger border border-danger-subtle' :
                          'bg-secondary-subtle text-secondary border border-secondary-subtle'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          {r.status === 'Pending' ? (
                            <>
                              <button
                                className="btn btn-success btn-xs px-2.5 py-1.5 rounded-3 fw-semibold text-xs d-flex align-items-center gap-1 text-white"
                                onClick={() => handleStatusUpdate(r._id, 'Approved')}
                              >
                                <FiCheck size={12} />
                                <span>Accept</span>
                              </button>
                              <button
                                className="btn btn-outline-danger btn-xs px-2.5 py-1.5 rounded-3 fw-semibold text-xs d-flex align-items-center gap-1"
                                onClick={() => handleStatusUpdate(r._id, 'Rejected')}
                              >
                                <FiX size={12} />
                                <span>Reject</span>
                              </button>
                            </>
                          ) : (
                            <span className="text-muted text-xs">Closed</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default MyBookings;
