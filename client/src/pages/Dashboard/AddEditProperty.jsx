import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
 import api, { SERVER_URL } from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { FiHome, FiImage, FiPlus, FiTrash2, FiInfo } from 'react-icons/fi';

const AddEditProperty = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    deposit: '',
    propertyType: 'Apartment',
    bedrooms: '2',
    bathrooms: '2',
    area: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    furnished: 'Unfurnished',
    parking: false,
    petFriendly: false,
    amenities: '',
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [clearExisting, setClearExisting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchProperty = async () => {
        try {
          const res = await api.get(`/properties/${id}`);
          if (res.data.success) {
            const p = res.data.property;
            setFormData({
              title: p.title || '',
              description: p.description || '',
              price: p.price || '',
              deposit: p.deposit || '',
              propertyType: p.propertyType || 'Apartment',
              bedrooms: p.bedrooms ? p.bedrooms.toString() : '1',
              bathrooms: p.bathrooms ? p.bathrooms.toString() : '1',
              area: p.area || '',
              address: p.address || '',
              city: p.city || '',
              state: p.state || '',
              pincode: p.pincode || '',
              furnished: p.furnished || 'Unfurnished',
              parking: !!p.parking,
              petFriendly: !!p.petFriendly,
              amenities: p.amenities ? p.amenities.join(', ') : '',
            });
            setExistingImages(p.images || []);
          }
        } catch (err) {
          toast.error('Failed to load property details');
          navigate('/dashboard/my-properties');
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price || !formData.deposit || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast.warning('Please fill in all required fields.');
      return;
    }

    setSubmitLoading(true);
    const postData = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      postData.append(key, val);
    });

    if (images.length > 0) {
      images.forEach((img) => {
        postData.append('images', img);
      });
    }

    if (isEditMode) {
      if (clearExisting) {
        postData.append('clearExistingImages', 'true');
      }
    }

    try {
      let res;
      if (isEditMode) {
        res = await api.put(`/properties/${id}`, postData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await api.post('/properties', postData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (res.data.success) {
        toast.success(
          isEditMode
            ? 'Property updated! Awaiting admin review.'
            : 'Property added successfully! Listing will be public once approved by admin.'
        );
        navigate('/dashboard/my-properties');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit property listing');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="fade-in-up">
      <div className="mb-4">
        <h3 className="fw-bold">{isEditMode ? 'Edit Rental Property' : 'List New Rental Property'}</h3>
        <p className="text-secondary">Provide detailed descriptions, pricing, address and features of your property.</p>
      </div>

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
        <div className="row g-4">
          {/* Main Info Card */}
          <div className="col-lg-8">
            <div className="card border-0 glass-card p-4 d-flex flex-column gap-3.5">
              <h5 className="fw-bold text-primary m-0 mb-1">Basic Details</h5>

              <div>
                <label className="form-label text-sm fw-semibold text-secondary">Property Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Elegant 2BHK Apartment with Pool View"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label text-sm fw-semibold text-secondary">Description *</label>
                <textarea
                  rows="5"
                  className="form-control"
                  placeholder="Describe property features, safety locks, space layout, vicinity perks..."
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-sm fw-semibold text-secondary">Monthly Rent (₹) *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 20000"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-sm fw-semibold text-secondary">Security Deposit (₹) *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 60000"
                    name="deposit"
                    value={formData.deposit}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row g-3 border-top pt-4" style={{ borderColor: 'var(--border-color)' }}>
                <div className="col-md-4">
                  <label className="form-label text-sm fw-semibold text-secondary">Property Type *</label>
                  <select
                    className="form-select"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Independent House">Independent House</option>
                    <option value="PG">PG</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label text-sm fw-semibold text-secondary">Furnished Status</label>
                  <select
                    className="form-select"
                    name="furnished"
                    value={formData.furnished}
                    onChange={handleChange}
                  >
                    <option value="Furnished">Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label text-sm fw-semibold text-secondary">Area Size (sqft) *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 1100"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-sm fw-semibold text-secondary">Bedrooms *</label>
                  <select
                    className="form-select"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                  >
                    <option value="1">1 BHK / Room</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4+ BHK</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-sm fw-semibold text-secondary">Bathrooms *</label>
                  <select
                    className="form-select"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                  >
                    <option value="1">1 Bath</option>
                    <option value="2">2 Baths</option>
                    <option value="3">3+ Baths</option>
                  </select>
                </div>
              </div>

              {/* Address details */}
              <h5 className="fw-bold text-primary m-0 mb-1 border-top pt-4" style={{ borderColor: 'var(--border-color)' }}>Location Details</h5>
              <div>
                <label className="form-label text-sm fw-semibold text-secondary">Detailed Address *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Flat 302, Green Meadows Lane"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label text-sm fw-semibold text-secondary">City *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Bangalore"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-sm fw-semibold text-secondary">State *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Karnataka"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-sm fw-semibold text-secondary">Pincode *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="560100"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar configuration & Images */}
          <div className="col-lg-4 d-flex flex-column gap-4">
            {/* Images Upload Card */}
            <div className="card border-0 glass-card p-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FiImage className="text-primary" />
                <span>Upload Photos</span>
              </h5>

              <div className="d-flex flex-column gap-3">
                {/* Existing Images preview */}
                {isEditMode && existingImages.length > 0 && !clearExisting && (
                  <div>
                    <label className="form-label text-xs fw-semibold text-muted">Current Photos</label>
                    <div className="d-flex flex-wrap gap-1.5 mb-2">
                      {existingImages.map((img, i) => (
                        <div key={i} className="rounded border overflow-hidden" style={{ width: '50px', height: '40px' }}>
                          <img src={` ${SERVER_URL}${img}`} alt="Preview" className="w-100 h-100 object-fit-cover" />
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-xs w-100 rounded-3 py-1 fw-semibold text-xs d-flex align-items-center justify-content-center gap-1"
                      onClick={() => setClearExisting(true)}
                    >
                      <FiTrash2 size={12} />
                      <span>Remove Old Photos</span>
                    </button>
                  </div>
                )}

                {clearExisting && (
                  <div className="alert alert-warning py-2 text-xs mb-0">Old photos will be removed when you submit the form.</div>
                )}

                <div>
                  <label className="form-label text-sm fw-semibold text-secondary">Select New Images</label>
                  <input
                    type="file"
                    className="form-control text-sm"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <small className="text-muted mt-1 d-block">You can select up to 6 images. Format: JPG, PNG, WEBP.</small>
                </div>
              </div>
            </div>

            {/* Amenities & Checkboxes Card */}
            <div className="card border-0 glass-card p-4">
              <h5 className="fw-bold mb-3 text-primary">Features & Amenities</h5>

              <div className="d-flex flex-column gap-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="parking-check"
                    name="parking"
                    checked={formData.parking}
                    onChange={handleChange}
                  />
                  <label className="form-check-label text-sm fw-medium" htmlFor="parking-check">
                    Parking Space Available
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="pet-check"
                    name="petFriendly"
                    checked={formData.petFriendly}
                    onChange={handleChange}
                  />
                  <label className="form-check-label text-sm fw-medium" htmlFor="pet-check">
                    Pet Friendly / Allowed
                  </label>
                </div>

                <div className="mt-2.5">
                  <label className="form-label text-sm fw-semibold text-secondary">Amenities (Comma separated)</label>
                  <textarea
                    rows="3"
                    className="form-control text-sm"
                    placeholder="WiFi, AC, Gym, Swimming Pool, Lift, Power Backup, 24/7 Security"
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Note alert */}
            <div className="alert alert-info d-flex gap-2 rounded-3 p-3 mb-0" style={{ fontSize: '0.85rem' }}>
              <FiInfo className="flex-shrink-0 text-primary mt-0.5" size={16} />
              <span>
                <strong>Awaiting approval:</strong> Listing edits or additions are automatically marked as pending and need administrator review before going public.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-3">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-3 py-2.5 fw-semibold flex-grow-1"
                onClick={() => navigate('/dashboard/my-properties')}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-gradient-primary rounded-3 py-2.5 fw-bold flex-grow-1" disabled={submitLoading}>
                {submitLoading ? 'Submitting...' : isEditMode ? 'Update Listing' : 'List Property'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEditProperty;
