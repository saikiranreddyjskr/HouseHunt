import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { FiHome, FiEdit, FiTrash2, FiEye, FiPlus } from 'react-icons/fi';

const MyProperties = () => {
  const { user } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProperties = async () => {
    try {
      const res = await api.get(`/properties?owner=${user._id}`);
      if (res.data.success) {
        setProperties(res.data.properties);
      }
    } catch (err) {
      toast.error('Failed to load your property listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, [user]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete the listing: "${title}"?`)) {
      try {
        const res = await api.delete(`/properties/${id}`);
        if (res.data.success) {
          toast.success('Property listing deleted successfully.');
          setProperties(properties.filter((p) => p._id !== id));
        }
      } catch (err) {
        toast.error('Failed to delete property listing');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="fade-in-up">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold m-0">My Property Listings</h3>
          <p className="text-secondary m-0 mt-1">Manage listings, edit rental details, or view approval status.</p>
        </div>
        <Link to="/dashboard/add-property" className="btn btn-gradient-primary rounded-3 d-flex align-items-center gap-1.5 px-3 py-2 fw-semibold">
          <FiPlus size={16} />
          <span>Add Property</span>
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="card border-0 glass-card p-5 text-center d-flex flex-column align-items-center justify-content-center">
          <FiHome size={48} className="text-muted mb-3" />
          <h5>No Properties Listed</h5>
          <p className="text-secondary max-w-sm">You haven't listed any houses or flats yet. Click the button above to get started.</p>
          <Link to="/dashboard/add-property" className="btn btn-primary rounded-3 mt-2 px-4 py-2">
            List Your First Property
          </Link>
        </div>
      ) : (
        <div className="card border-0 glass-card p-3 overflow-hidden">
          <div className="table-responsive">
            <table className="table align-middle m-0">
              <thead>
                <tr>
                  <th scope="col" className="border-0">Property</th>
                  <th scope="col" className="border-0">Type</th>
                  <th scope="col" className="border-0">Rent Price</th>
                  <th scope="col" className="border-0">City</th>
                  <th scope="col" className="border-0">Approval Status</th>
                  <th scope="col" className="border-0">Rental Status</th>
                  <th scope="col" className="border-0 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p._id} className="border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded overflow-hidden flex-shrink-0" style={{ width: '60px', height: '45px', background: '#e2e8f0' }}>
                          <img
                            src={p.images && p.images.length > 0 ? `http://localhost:5000${p.images[0]}` : 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=80&q=80'}
                            alt="Property miniature"
                            className="w-100 h-100 object-fit-cover"
                          />
                        </div>
                        <div style={{ maxWidth: '200px' }}>
                          <h6 className="fw-bold text-truncate m-0" title={p.title}>{p.title}</h6>
                          <small className="text-muted text-truncate d-block">{p.address}</small>
                        </div>
                      </div>
                    </td>
                    <td><span className="text-secondary text-sm fw-medium">{p.propertyType}</span></td>
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
                      <span className={`badge px-2.5 py-1.5 rounded-pill fs-8 ${
                        p.status === 'Available' ? 'bg-info-subtle text-info border border-info-subtle' : 'bg-secondary-subtle text-secondary border border-secondary-subtle'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center justify-content-end gap-2">
                        <Link to={`/properties/${p._id}`} className="btn btn-sm btn-light border p-2 rounded-3 text-secondary" title="View Public Page">
                          <FiEye size={14} />
                        </Link>
                        <Link to={`/dashboard/edit-property/${p._id}`} className="btn btn-sm btn-light border p-2 rounded-3 text-primary" title="Edit Listing">
                          <FiEdit size={14} />
                        </Link>
                        <button
                          className="btn btn-sm btn-light border p-2 rounded-3 text-danger"
                          title="Delete Listing"
                          onClick={() => handleDelete(p._id, p.title)}
                        >
                          <FiTrash2 size={14} />
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

export default MyProperties;
