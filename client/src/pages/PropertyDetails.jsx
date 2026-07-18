import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api, { SERVER_URL } from '../utils/api';
import PropertyGallery from '../components/property/PropertyGallery';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PropertyCard from '../components/common/PropertyCard';
import { toast } from 'react-toastify';
import {
  FiMapPin,
  FiMaximize2,
  FiActivity,
  FiMessageSquare,
  FiCalendar,
  FiCheckCircle,
  FiInfo,
} from 'react-icons/fi';
import { BiBed, BiBath } from 'react-icons/bi';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [moveInDate, setMoveInDate] = useState('');
  const [duration, setDuration] = useState('11');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Messaging State
  const [messageText, setMessageText] = useState('');
  const [messageLoading, setMessageLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/properties/${id}`);
        if (res.data.success) {
          setProperty(res.data.property);
          fetchSimilar(res.data.property.propertyType, res.data.property.city);
        }
      } catch (err) {
        toast.error('Failed to load property details');
        navigate('/properties');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const fetchSimilar = async (type, city) => {
    try {
      const res = await api.get(`/properties?propertyType=${type}&city=${city}&limit=3`);
      if (res.data.success) {
        // filter out current property
        const filtered = res.data.properties.filter((p) => p._id !== id);
        setSimilarProperties(filtered);
      }
    } catch (err) {
      console.error('Failed to load similar properties', err);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please login to book a property.');
      navigate('/login');
      return;
    }

    if (!moveInDate) {
      toast.warning('Please specify your move-in date.');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await api.post('/bookings', {
        propertyId: property._id,
        moveInDate,
        duration,
      });

      if (res.data.success) {
        toast.success('Booking request sent successfully!');
        navigate('/dashboard/bookings');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking submission failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please login to message the owner.');
      navigate('/login');
      return;
    }

    if (!messageText.trim()) {
      toast.warning('Please write a message content.');
      return;
    }

    setMessageLoading(true);
    try {
      const res = await api.post('/messages', {
        receiverId: property.owner._id,
        message: messageText,
        propertyId: property._id,
      });

      if (res.data.success) {
        toast.success('Message sent to the owner!');
        setMessageText('');
        navigate('/dashboard/messages');
      }
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setMessageLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!property) return <div className="container py-5 text-center mt-5"><h4>Property not found.</h4></div>;

  const isOwner = user && property.owner._id === user._id;

  return (
    <div className="container py-5 fade-in-up" style={{ marginTop: '70px' }}>
      {/* Property Title Header */}
      <div className="row mb-4 align-items-start justify-content-between g-3">
        <div className="col-lg-8">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge bg-primary px-3 py-2 rounded-2 fs-7">{property.propertyType}</span>
            <span className={`badge px-3 py-2 rounded-2 fs-7 ${property.status === 'Available' ? 'bg-success' : 'bg-warning'}`}>
              {property.status}
            </span>
          </div>
          <h2 className="fw-bold mb-2">{property.title}</h2>
          <p className="text-secondary d-flex align-items-center gap-1.5 m-0" style={{ fontSize: '0.95rem' }}>
            <FiMapPin className="text-primary" />
            <span>{property.address}, {property.city}, {property.state} - {property.pincode}</span>
          </p>
        </div>
        <div className="col-lg-4 text-lg-end">
          <span className="text-muted d-block text-sm">Monthly Rent</span>
          <h3 className="fw-bold text-gradient mb-1">₹{property.price.toLocaleString()}</h3>
          <span className="badge border text-secondary px-2.5 py-1.5 fs-7 bg-light">Security Deposit: ₹{property.deposit.toLocaleString()}</span>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Gallery & Details */}
        <div className="col-lg-8">
          {/* Gallery */}
          <div className="mb-4">
            <PropertyGallery images={property.images} />
          </div>

          {/* Details Card */}
          <div className="card border-0 glass-card p-4 mb-4">
            <h4 className="fw-bold mb-3">Property Description</h4>
            <p className="text-secondary lh-lg mb-4" style={{ whiteSpace: 'pre-line' }}>{property.description}</p>

            <h4 className="fw-bold mb-3 border-top pt-4" style={{ borderColor: 'var(--border-color)' }}>Specifications</h4>
            <div className="row g-3 text-center mb-4">
              <div className="col-4 col-sm-3">
                <div className="border rounded-3 p-3 bg-light" style={{ borderColor: 'var(--border-color)' }}>
                  <BiBed size={24} className="text-primary mb-1" />
                  <span className="d-block text-xs text-muted">Bedrooms</span>
                  <span className="fw-bold text-sm text-secondary">{property.bedrooms} BHK</span>
                </div>
              </div>
              <div className="col-4 col-sm-3">
                <div className="border rounded-3 p-3 bg-light" style={{ borderColor: 'var(--border-color)' }}>
                  <BiBath size={24} className="text-primary mb-1" />
                  <span className="d-block text-xs text-muted">Bathrooms</span>
                  <span className="fw-bold text-sm text-secondary">{property.bathrooms} Baths</span>
                </div>
              </div>
              <div className="col-4 col-sm-3">
                <div className="border rounded-3 p-3 bg-light" style={{ borderColor: 'var(--border-color)' }}>
                  <FiMaximize2 size={22} className="text-primary mb-1" />
                  <span className="d-block text-xs text-muted">Area</span>
                  <span className="fw-bold text-sm text-secondary">{property.area} sqft</span>
                </div>
              </div>
              <div className="col-4 col-sm-3">
                <div className="border rounded-3 p-3 bg-light" style={{ borderColor: 'var(--border-color)' }}>
                  <FiActivity size={22} className="text-primary mb-1" />
                  <span className="d-block text-xs text-muted">Furnishing</span>
                  <span className="fw-bold text-sm text-secondary">{property.furnished}</span>
                </div>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-6">
                <div className="d-flex align-items-center gap-2">
                  <FiCheckCircle className={property.parking ? "text-success" : "text-muted"} />
                  <span className="fw-medium text-secondary">Parking {property.parking ? 'Available' : 'Not Available'}</span>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center gap-2">
                  <FiCheckCircle className={property.petFriendly ? "text-success" : "text-muted"} />
                  <span className="fw-medium text-secondary">{property.petFriendly ? 'Pet Friendly' : 'No Pets Allowed'}</span>
                </div>
              </div>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <>
                <h4 className="fw-bold mb-3 border-top pt-4 mt-4" style={{ borderColor: 'var(--border-color)' }}>Amenities</h4>
                <div className="d-flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => (
                    <span key={amenity} className="badge bg-light border text-secondary px-3 py-2 rounded-pill fs-7">
                      {amenity}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Maps Placeholder */}
            <h4 className="fw-bold mb-3 border-top pt-4 mt-4" style={{ borderColor: 'var(--border-color)' }}>Location Map</h4>
            <div className="rounded-4 overflow-hidden border bg-light position-relative d-flex align-items-center justify-content-center" style={{ height: '240px' }}>
              <iframe
                title="Google Maps Placeholder"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(property.address + ' ' + property.city)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Actions */}
        <div className="col-lg-4">
          {/* Owner Profile Card */}
          <div className="card border-0 glass-card p-4 mb-4">
            <h5 className="fw-bold mb-3">Listed By</h5>
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                style={{ width: '56px', height: '56px', fontSize: '1.4rem' }}
              >
                {property.owner.profilePicture ? (
                  <img
                    src={` ${SERVER_URL}${property.owner.profilePicture}`}
                    alt="Owner profile"
                    className="rounded-circle w-100 h-100 object-fit-cover"
                  />
                ) : (
                  property.owner.name[0]
                )}
              </div>
              <div>
                <h6 className="fw-bold m-0 fs-5">{property.owner.name}</h6>
                <small className="text-muted d-block">{property.owner.email}</small>
                {property.owner.phone && <small className="text-secondary d-block mt-0.5">{property.owner.phone}</small>}
              </div>
            </div>
            {property.owner.bio && <p className="text-secondary text-sm mb-3">"{property.owner.bio}"</p>}

            {/* Message Form */}
            {!isOwner && (
              <form onSubmit={handleSendMessage} className="border-top pt-3" style={{ borderColor: 'var(--border-color)' }}>
                <label className="form-label text-sm fw-semibold text-secondary">Send a message to Landlord</label>
                <div className="d-flex flex-column gap-2">
                  <textarea
                    rows="3"
                    className="form-control text-sm"
                    placeholder="Ask about deposits, utilities, availability..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  ></textarea>
                  <button type="submit" className="btn btn-outline-primary rounded-3 w-100 py-2 d-flex align-items-center justify-content-center gap-2" disabled={messageLoading}>
                    <FiMessageSquare size={16} />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Booking Request Card */}
          <div className="card border-0 glass-card p-4">
            <h5 className="fw-bold mb-3">Book Property</h5>

            {isOwner ? (
              <div className="alert alert-info d-flex align-items-start gap-2 m-0 p-3 rounded-3">
                <FiInfo className="flex-shrink-0 mt-0.5 text-primary" size={18} />
                <span className="text-sm">You are the owner of this listing. You can manage booking requests in your owner dashboard.</span>
              </div>
            ) : property.status !== 'Available' ? (
              <div className="alert alert-warning d-flex align-items-start gap-2 m-0 p-3 rounded-3">
                <FiInfo className="flex-shrink-0 mt-0.5 text-warning" size={18} />
                <span className="text-sm">This property is currently <strong>{property.status}</strong>. Bookings are temporarily locked.</span>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label text-sm fw-semibold text-secondary">Move-in Date</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><FiCalendar /></span>
                    <input
                      type="date"
                      className="form-control border-start-0"
                      value={moveInDate}
                      onChange={(e) => setMoveInDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label text-sm fw-semibold text-secondary">Rental Duration (Months)</label>
                  <select
                    className="form-select"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="11">11 Months</option>
                    <option value="12">12+ Months</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-gradient-primary rounded-3 w-100 py-2.5 fw-bold" disabled={bookingLoading}>
                  {bookingLoading ? 'Submitting Request...' : 'Send Booking Request'}
                </button>

                <small className="text-muted text-center d-block">
                  Owner will review your request and contact you. No payment is charged right now.
                </small>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div className="mt-5 border-top pt-5" style={{ borderColor: 'var(--border-color)' }}>
          <h3 className="fw-bold mb-4">Similar Properties Nearby</h3>
          <div className="row g-4">
            {similarProperties.map((p) => (
              <div key={p._id} className="col-md-4">
                <PropertyCard property={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
