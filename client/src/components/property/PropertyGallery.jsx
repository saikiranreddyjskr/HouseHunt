import React, { useState } from 'react';
import { SERVER_URL } from '../../utils/api';

const PropertyGallery = ({ images }) => {
  const defaultPlaceholder = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80';
  const displayImages = images && images.length > 0 ? images : [defaultPlaceholder];
  const [activeImage, setActiveImage] = useState(displayImages[0]);

  const getFullUrl = (img) => {
  return img.startsWith('http') ? img : `${SERVER_URL}${img}`;
  };

  return (
    <div className="d-flex flex-column gap-3">
      {/* Big Main Image */}
      <div className="rounded-4 overflow-hidden border" style={{ height: '400px', background: '#e2e8f0' }}>
        <img
          src={getFullUrl(activeImage)}
          alt="Active Property Visual"
          className="w-100 h-100 object-fit-cover transition"
        />
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="d-flex gap-2.5 overflow-x-auto pb-2">
          {displayImages.map((img, index) => (
            <button
              key={index}
              className={`btn p-0 border rounded-3 overflow-hidden flex-shrink-0 ${
                activeImage === img ? 'border-primary border-2 shadow-sm' : 'border-secondary opacity-75'
              }`}
              style={{ width: '80px', height: '60px' }}
              onClick={() => setActiveImage(img)}
              type="button"
            >
              <img
                src={getFullUrl(img)}
                alt={`Property thumbnail ${index + 1}`}
                className="w-100 h-100 object-fit-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
