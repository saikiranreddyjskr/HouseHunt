import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api, { SERVER_URL } from '../../utils/api';
import { toast } from 'react-toastify';
import { FiHeart, FiMapPin, FiMaximize } from 'react-icons/fi';
import { BiBed, BiBath } from 'react-icons/bi';

const PropertyCard = ({ property, isInitiallyFavorited = false, onFavoriteToggle }) => {
  const { user } = useContext(AuthContext);
  const [isFavorited, setIsFavorited] = useState(isInitiallyFavorited);
  const [favLoading, setFavLoading] = useState(false);
  const navigate = useNavigate();

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.info('Please login to save properties to your wishlist.');
      navigate('/login');
      return;
    }

    setFavLoading(true);
    try {
      const res = await api.post(`/properties/${property._id}/favorite`);
      if (res.data.success) {
        setIsFavorited(res.data.favorited);
        toast.success(res.data.message);
        if (onFavoriteToggle) {
          onFavoriteToggle(property._id, res.data.favorited);
        }
      }
    } catch (err) {
      toast.error('Failed to update wishlist');
    } finally {
      setFavLoading(false);
    }
  };

  const imageUrl = property.images && property.images.length > 0
     ? `${SERVER_URL}${property.images[0]}`
    : 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="card h-100 border-0 glass-card p-2">
      <div className="position-relative overflow-hidden rounded-3" style={{ height: '220px' }}>
        <img
          src={imageUrl}
          alt={property.title}
          className="w-100 h-100 object-fit-cover transition"
          style={{ transition: 'transform 0.5s ease' }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.00)')}
        />
        {/* Price Tag Overlay */}
        <span
          className="position-absolute bottom-3 start-3 px-3 py-1.5 rounded-3 fw-bold shadow-sm"
          style={{
            background: 'var(--bg-secondary)',
            color: 'var(--primary)',
            bottom: '12px',
            left: '12px',
            fontSize: '1.05rem',
            border: '1px solid var(--border-color)',
          }}
        >
          ₹{property.price.toLocaleString()}/mo
        </span>
        {/* Property Type Badge Overlay */}
        <span
          className="position-absolute top-3 start-3 badge rounded-2 px-2.5 py-1.5 shadow-sm fw-semibold"
          style={{
            background: 'var(--primary)',
            color: '#fff',
            top: '12px',
            left: '12px',
          }}
        >
          {property.propertyType}
        </span>
        {/* Favorite Icon Overlay */}
        <button
          className={`position-absolute top-3 end-3 btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm ${
            isFavorited ? 'text-danger' : 'text-secondary'
          }`}
          style={{
            top: '12px',
            right: '12px',
            width: '38px',
            height: '38px',
            background: 'var(--bg-secondary)',
            border: 'none',
            zIndex: 5,
          }}
          disabled={favLoading}
          onClick={handleFavorite}
          aria-label="Save Property"
        >
          <FiHeart size={18} fill={isFavorited ? 'red' : 'none'} />
        </button>
      </div>

      <div className="card-body px-2 pt-3 pb-2 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex align-items-center text-muted mb-2 gap-1" style={{ fontSize: '0.85rem' }}>
            <FiMapPin size={14} className="text-secondary" />
            <span className="text-truncate">{property.city}, {property.state}</span>
          </div>
          <h5 className="card-title fw-bold text-truncate mb-3" style={{ fontSize: '1.15rem' }}>
            {property.title}
          </h5>

          {/* Quick Specifications */}
          <div className="d-flex align-items-center justify-content-between mb-4 border-top border-bottom py-2" style={{ borderColor: 'var(--border-color) !important' }}>
            <div className="d-flex align-items-center gap-1.5">
              <BiBed size={18} className="text-primary" />
              <span className="fw-medium text-sm text-secondary">{property.bedrooms} Beds</span>
            </div>
            <div className="d-flex align-items-center gap-1.5">
              <BiBath size={18} className="text-primary" />
              <span className="fw-medium text-sm text-secondary">{property.bathrooms} Baths</span>
            </div>
            <div className="d-flex align-items-center gap-1.5">
              <FiMaximize size={16} className="text-primary" />
              <span className="fw-medium text-sm text-secondary">{property.area} sqft</span>
            </div>
          </div>
        </div>

        <div className="d-grid gap-2">
          <Link to={`/properties/${property._id}`} className="btn btn-outline-primary rounded-3 py-2 fw-semibold text-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
