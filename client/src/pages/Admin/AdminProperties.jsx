import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { SERVER_URL } from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { FiHome, FiCheck, FiX, FiTrash2, FiEye } from 'react-icons/fi';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const res = await api.get('/admin/properties');
      if (res.data.success) {
        setProperties(res.data.properties);
      }
    } catch (err) {
      toast.error('Failed to load listings data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleApproval = async (id, approve, title) => {
    const action = approve ? 'approve' : 'unapprove';
    if (window.confirm(`Are you sure you want to ${action} listing "${title}"?`)) {
      try {
        const res = await api.put(`/admin/properties/${id}/approve`, { approve });
        if (res.data.success) {
          toast.success(res.data.message);
          setProperties((prev) =>
            prev.map((p) => (p._id === id ? { ...p, approved: approve } : p))
          );
        }
      } catch (err) {
        toast.error('Failed to update listing approval');
      }
    }
  };

  const handleDeleteListing = async (id, title) => {
    if (window.confirm(`Are you sure you want to PERMANENTLY delete listing "${title}"? This cannot be undone.`)) {
      try {
        const res = await api.delete(`/properties/${id}`);
        if (res.data.success) {
          toast.success('Listing deleted successfully');
          setProperties((prev) => prev.filter((p) => p._id !== id));
        }
      } catch (err) {
        toast.error('Deletion failed');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="fade-in-up">
      <div className="mb-4">
        <h3 className="fw-bold">Platform Properties Listing Approvals</h3>
        <p className="text-secondary">Review submissions, approve authentic rentals, or remove spam listings.</p>
      </div>

      {properties.length === 0 ? (
        <div className="card border-0 glass-card p-5 text-center d-flex flex-column align-items-center justify-content-center">
          <FiHome size={48} className="text-muted mb-3" />
          <h5>No Properties Submissions</h5>
          <p className="text-secondary">There are no property listings in the database at the moment.</p>
        </div>
      ) : (
        <div className="card border-0 glass-card p-3 overflow-hidden">
          <div className="table-responsive">
            <table className="table align-middle m-0">
              <thead>
                <tr>
                  <th scope="col" className="border-0">Property details</th>
                  <th scope="col" className="border-0">Owner Info</th>
                  <th scope="col" className="border-0">Rent Price</th>
                  <th scope="col" className="border-0">City</th>
                  <th scope="col" className="border-0">Approval Status</th>
                  <th scope="col" className="border-0 text-end">Manage Action</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p._id} className="border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded overflow-hidden flex-shrink-0" style={{ width: '55px', height: '40px', background: '#e2e8f0' }}>
                          <img
                            src={p.images && p.images.length > 0 ? ` ${SERVER_URL}${p.images[0]}` : 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=60&q=80'}
                            alt="Property thumbnail"
                            className="w-100 h-100 object-fit-cover"
                          />
                        </div>
                        <div style={{ maxWidth: '200px' }}>
                          <h6 className="fw-bold m-0 text-sm text-truncate" title={p.title}>{p.title}</h6>
                          <small className="text-muted text-xs capitalize">{p.propertyType} • {p.address}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <span className="fw-medium text-dark d-block">{p.owner?.name || 'Unknown'}</span>
                        <span className="text-muted text-xs">{p.owner?.email}</span>
                      </div>
                    </td>
                    <td><span className="fw-bold text-sm text-primary">₹{p.price.toLocaleString()}</span></td>
                    <td><span className="text-secondary text-sm">{p.city}</span></td>
                    <td>
                      {p.approved ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded-pill fs-8">
                          Approved
                        </span>
                      ) : (
                        <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2.5 py-1.5 rounded-pill fs-8">
                          Pending Approval
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex align-items-center justify-content-end gap-2">
                        <Link to={`/properties/${p._id}`} className="btn btn-sm btn-light border p-2 rounded-3 text-secondary" title="View Public Page">
                          <FiEye size={13} />
                        </Link>
                        {p.approved ? (
                          <button
                            className="btn btn-sm btn-light border p-2 rounded-3 text-warning"
                            title="Reject/Unapprove Listing"
                            onClick={() => handleApproval(p._id, false, p.title)}
                          >
                            <FiX size={13} />
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-light border p-2 rounded-3 text-success"
                            title="Approve Listing"
                            onClick={() => handleApproval(p._id, true, p.title)}
                          >
                            <FiCheck size={13} />
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-light border p-2 rounded-3 text-danger"
                          title="Force Delete Listing"
                          onClick={() => handleDeleteListing(p._id, p.title)}
                        >
                          <FiTrash2 size={13} />
                        </button>
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

export default AdminProperties;
