import React from 'react';
import { FiSliders, FiRefreshCw } from 'react-icons/fi';

const SearchFilters = ({ filters, onFilterChange, onReset }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFilterChange(name, type === 'checkbox' ? checked : value);
  };

  return (
    <div className="card border-0 glass-card p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
          <FiSliders className="text-primary" />
          <span>Filters</span>
        </h5>
        <button
          className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-1.5 px-3 py-1.5"
          onClick={onReset}
          type="button"
        >
          <FiRefreshCw size={12} />
          <span>Reset</span>
        </button>
      </div>

      <div className="d-flex flex-column gap-3.5">
        {/* City Filter */}
        <div>
          <label className="form-label fw-semibold text-secondary text-sm">City</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Bangalore"
            name="city"
            value={filters.city}
            onChange={handleChange}
          />
        </div>

        {/* State Filter */}
        <div>
          <label className="form-label fw-semibold text-secondary text-sm">State</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Karnataka"
            name="state"
            value={filters.state}
            onChange={handleChange}
          />
        </div>

        {/* Property Type Filter */}
        <div>
          <label className="form-label fw-semibold text-secondary text-sm">Property Type</label>
          <select
            className="form-select"
            name="propertyType"
            value={filters.propertyType}
            onChange={handleChange}
          >
            <option value="">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Independent House">Independent House</option>
            <option value="PG">PG</option>
            <option value="Hostel">Hostel</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>

        {/* Price Range Filters */}
        <div>
          <label className="form-label fw-semibold text-secondary text-sm">Monthly Rent Range (₹)</label>
          <div className="d-flex gap-2">
            <input
              type="number"
              className="form-control"
              placeholder="Min"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
            />
            <input
              type="number"
              className="form-control"
              placeholder="Max"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Bedrooms Filter */}
        <div>
          <label className="form-label fw-semibold text-secondary text-sm">Bedrooms</label>
          <select
            className="form-select"
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4+ BHK</option>
          </select>
        </div>

        {/* Bathrooms Filter */}
        <div>
          <label className="form-label fw-semibold text-secondary text-sm">Bathrooms</label>
          <select
            className="form-select"
            name="bathrooms"
            value={filters.bathrooms}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="1">1 Bath</option>
            <option value="2">2 Baths</option>
            <option value="3">3+ Baths</option>
          </select>
        </div>

        {/* Furnished Filter */}
        <div>
          <label className="form-label fw-semibold text-secondary text-sm">Furnishing Status</label>
          <select
            className="form-select"
            name="furnished"
            value={filters.furnished}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="Furnished">Furnished</option>
            <option value="Semi-Furnished">Semi-Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
          </select>
        </div>

        <hr className="my-2" style={{ borderColor: 'var(--border-color)' }} />

        {/* Checkbox Options */}
        <div className="d-flex flex-column gap-2">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="parking"
              name="parking"
              checked={filters.parking}
              onChange={handleChange}
            />
            <label className="form-check-label text-sm fw-medium" htmlFor="parking">
              Parking Available
            </label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="petFriendly"
              name="petFriendly"
              checked={filters.petFriendly}
              onChange={handleChange}
            />
            <label className="form-check-label text-sm fw-medium" htmlFor="petFriendly">
              Pet Friendly
            </label>
          </div>
        </div>

        <hr className="my-2" style={{ borderColor: 'var(--border-color)' }} />

        {/* Sorting */}
        <div>
          <label className="form-label fw-semibold text-secondary text-sm">Sort By</label>
          <select
            className="form-select"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
          >
            <option value="newest">Newest Listed</option>
            <option value="lowestPrice">Lowest Price</option>
            <option value="highestPrice">Highest Price</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
