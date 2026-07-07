import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import PropertyCard from '../components/common/PropertyCard';
import SearchFilters from '../components/property/SearchFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiSearch, FiAlertTriangle } from 'react-icons/fi';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  // Filter States
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
    propertyType: searchParams.get('propertyType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    furnished: searchParams.get('furnished') || '',
    parking: searchParams.get('parking') === 'true',
    petFriendly: searchParams.get('petFriendly') === 'true',
    sortBy: searchParams.get('sortBy') || 'newest',
    search: searchParams.get('search') || '',
    page: searchParams.get('page') || '1',
  });

  useEffect(() => {
    // Sync filters from URL search params on back/forward
    setFilters({
      city: searchParams.get('city') || '',
      state: searchParams.get('state') || '',
      propertyType: searchParams.get('propertyType') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      bathrooms: searchParams.get('bathrooms') || '',
      furnished: searchParams.get('furnished') || '',
      parking: searchParams.get('parking') === 'true',
      petFriendly: searchParams.get('petFriendly') === 'true',
      sortBy: searchParams.get('sortBy') || 'newest',
      search: searchParams.get('search') || '',
      page: searchParams.get('page') || '1',
    });
  }, [searchParams]);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, val]) => {
          if (val !== '' && val !== false && val !== null) {
            queryParams.append(key, val);
          }
        });

        const res = await api.get(`/properties?${queryParams.toString()}`);
        if (res.data.success) {
          setProperties(res.data.properties);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('Failed to fetch properties', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value, page: '1' }; // Reset to page 1 on filter edit
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const handleReset = () => {
    const defaultFilters = {
      city: '',
      state: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      furnished: '',
      parking: false,
      petFriendly: false,
      sortBy: 'newest',
      search: '',
      page: '1',
    };
    setFilters(defaultFilters);
    setSearchParams({});
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFilterChange('page', '1');
  };

  const handlePageChange = (newPage) => {
    const newFilters = { ...filters, page: newPage.toString() };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const updateURLParams = (paramsObj) => {
    const newParams = {};
    Object.entries(paramsObj).forEach(([key, val]) => {
      if (val !== '' && val !== false && val !== null) {
        newParams[key] = val.toString();
      }
    });
    setSearchParams(newParams);
  };

  return (
    <div className="container py-5 fade-in-up" style={{ marginTop: '70px' }}>
      {/* Search Header */}
      <div className="row mb-5 justify-content-center">
        <div className="col-md-8 text-center">
          <h2 className="fw-bold mb-3">Explore Rental Properties</h2>
          <form onSubmit={handleSearchSubmit} className="d-flex gap-2 p-1.5 rounded-3 glass-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <div className="input-group align-items-center bg-transparent border-0 px-2 flex-grow-1">
              <FiSearch className="text-muted me-2" size={20} />
              <input
                type="text"
                className="form-control bg-transparent border-0"
                placeholder="Search location, title or keyword..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary rounded-3 px-4 py-2 fw-semibold">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="row g-4">
        {/* Sidebar Filters */}
        <div className="col-lg-3 col-md-4">
          <SearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        {/* Property Grid */}
        <div className="col-lg-9 col-md-8">
          {loading ? (
            <LoadingSpinner />
          ) : properties.length === 0 ? (
            <div className="card border-0 glass-card p-5 text-center mt-2 d-flex flex-column align-items-center justify-content-center">
              <FiAlertTriangle size={48} className="text-warning mb-3" />
              <h4>No Properties Found</h4>
              <p className="text-secondary max-w-sm">We couldn't find any rentals matching your criteria. Try loosening your filters or keyword query.</p>
              <button className="btn btn-primary rounded-3 mt-2" onClick={handleReset}>Clear All Filters</button>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {properties.map((property) => (
                  <div key={property._id} className="col-lg-4 col-md-6 col-sm-12">
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                  <nav aria-label="Page navigation">
                    <ul className="pagination gap-2 border-0">
                      <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link rounded-3 border-0 px-3.5 py-2.5"
                          style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                          onClick={() => handlePageChange(pagination.page - 1)}
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from({ length: pagination.totalPages }, (_, index) => (
                        <li key={index} className={`page-item ${pagination.page === index + 1 ? 'active' : ''}`}>
                          <button
                            className="page-link rounded-3 border-0 px-3.5 py-2.5"
                            style={{
                              background: pagination.page === index + 1 ? 'var(--primary)' : 'var(--bg-secondary)',
                              color: pagination.page === index + 1 ? '#ffffff' : 'var(--text-primary)',
                            }}
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link rounded-3 border-0 px-3.5 py-2.5"
                          style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                          onClick={() => handlePageChange(pagination.page + 1)}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;
