import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import PropertyCard from '../../components/common/PropertyCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiHeart } from 'react-icons/fi';

const SavedProperties = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get('/properties/favorites/all');
        if (res.data.success) {
          setFavorites(res.data.favorites);
        }
      } catch (err) {
        console.error('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleFavoriteToggle = (propertyId, isNowFavorited) => {
    // Since we are in the saved properties list, if the user unfavorites it, remove it immediately
    if (!isNowFavorited) {
      setFavorites((prev) => prev.filter((fav) => fav.property._id !== propertyId));
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="fade-in-up">
      <div className="mb-4">
        <h3 className="fw-bold">My Wishlist</h3>
        <p className="text-secondary">Keep track of properties you liked and book them when ready.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="card border-0 glass-card p-5 text-center d-flex flex-column align-items-center justify-content-center">
          <FiHeart size={48} className="text-muted mb-3" />
          <h5>No Saved Properties</h5>
          <p className="text-secondary max-w-sm">Browse our active properties listings and click the heart icon on any card to save it here.</p>
        </div>
      ) : (
        <div className="row g-4">
          {favorites.map((fav) => (
            <div key={fav._id} className="col-lg-4 col-md-6 col-sm-12">
              <PropertyCard
                property={fav.property}
                isInitiallyFavorited={true}
                onFavoriteToggle={handleFavoriteToggle}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedProperties;
