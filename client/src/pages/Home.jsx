import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import PropertyCard from '../components/common/PropertyCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiSearch, FiMapPin, FiHome, FiUsers, FiAward } from 'react-icons/fi';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await api.get('/properties?limit=3');
        if (res.data.success) {
          setFeaturedProperties(res.data.properties);
        }
      } catch (err) {
        console.error('Failed to load featured properties');
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/properties');
    }
  };

  return (
    <div className="fade-in-up">
      {/* 1. Hero Section */}
      <section
        className="d-flex align-items-center justify-content-center text-white position-relative"
        style={{
          background: 'linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.7)), url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '85vh',
          padding: '100px 0',
        }}
      >
        <div className="container text-center">
          <h1 className="display-4 fw-extrabold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            Find Your Perfect Home
          </h1>
          <p className="lead mb-5 max-w-2xl mx-auto" style={{ opacity: 0.9 }}>
            Discover the best apartments, villas, PGs, and commercial spaces in your city. Trusted by thousands.
          </p>

          {/* Search Box */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8">
              <form onSubmit={handleSearch} className="p-2 rounded-4 glass-card d-flex flex-column flex-md-row gap-2" style={{ background: 'rgba(255, 255, 255, 0.15)' }}>
                <div className="input-group align-items-center bg-transparent border-0 px-2 flex-grow-1">
                  <FiSearch className="text-white opacity-75 me-2" size={20} />
                  <input
                    type="text"
                    className="form-control bg-transparent border-0 text-white placeholder-white"
                    placeholder="Search by city, locality, property name..."
                    style={{ color: '#fff' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-gradient-primary rounded-3 px-4 py-2.5 fw-bold">
                  Search Properties
                </button>
              </form>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3">
            <Link to="/properties" className="btn btn-gradient-primary px-4 py-2.5 rounded-3 fw-bold">
              Find Property
            </Link>
            <Link to="/dashboard/properties" className="btn btn-gradient-secondary px-4 py-2.5 rounded-3 fw-bold">
              List Property
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Statistics Section */}
      <section className="py-5" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-3 col-6">
              <div className="p-3">
                <FiHome size={32} className="text-primary mb-2" />
                <h3 className="fw-bold mb-1">1,200+</h3>
                <p className="text-muted m-0">Properties Available</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-3">
                <FiUsers size={32} className="text-primary mb-2" />
                <h3 className="fw-bold mb-1">5,000+</h3>
                <p className="text-muted m-0">Happy Customers</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-3">
                <FiMapPin size={32} className="text-primary mb-2" />
                <h3 className="fw-bold mb-1">50+</h3>
                <p className="text-muted m-0">Cities Covered</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-3">
                <FiAward size={32} className="text-primary mb-2" />
                <h3 className="fw-bold mb-1">200+</h3>
                <p className="text-muted m-0">Trusted Agents</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Properties */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex align-items-end justify-content-between mb-5">
            <div>
              <span className="text-primary fw-bold text-uppercase tracking-wider">Top Picks</span>
              <h2 className="fw-bold m-0 mt-1">Featured Listings</h2>
            </div>
            <Link to="/properties" className="btn btn-outline-primary rounded-3 px-4 py-2 fw-semibold">
              Explore All
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : featuredProperties.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No approved properties listed yet. Seed the database to view samples.</p>
            </div>
          ) : (
            <div className="row g-4">
              {featuredProperties.map((property) => (
                <div key={property._id} className="col-lg-4 col-md-6">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Popular Cities */}
      <section className="py-5" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-primary fw-bold text-uppercase tracking-wider">Locations</span>
            <h2 className="fw-bold mt-1">Popular Cities</h2>
          </div>
          <div className="row g-4">
            {[
              { name: 'Bangalore', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80' },
              { name: 'Mumbai', img: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=400&q=80' },
              { name: 'Delhi', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80' },
              { name: 'Pune', img: 'https://images.unsplash.com/photo-1601999109332-542b18dbec57?auto=format&fit=crop&w=400&q=80' },
            ].map((city) => (
              <div key={city.name} className="col-md-3 col-sm-6">
                <Link to={`/properties?city=${city.name}`} className="text-decoration-none card border-0 overflow-hidden rounded-4 position-relative shadow-sm" style={{ height: '220px' }}>
                  <img src={city.img} alt={city.name} className="w-100 h-100 object-fit-cover" />
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end p-3 text-white"
                    style={{ background: 'linear-gradient(transparent, rgba(15, 23, 42, 0.8))' }}
                  >
                    <h5 className="fw-bold mb-0">{city.name}</h5>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-primary fw-bold text-uppercase tracking-wider">Reviews</span>
            <h2 className="fw-bold mt-1">What Our Clients Say</h2>
          </div>
          <div className="row g-4">
            {[
              { name: 'Rahul Sharma', role: 'Software Developer', quote: 'Finding an apartment in Bangalore was so difficult until I used HouseHunt. Within two days, I found a beautiful 2BHK that fit my budget perfectly.' },
              { name: 'Priya Patel', role: 'Property Owner', quote: 'I listed my studio flat on HouseHunt, and within 24 hours I had requests. The admin verification makes it secure and trustworthy for owners.' },
              { name: 'David Miller', role: 'Business Consultant', quote: 'The user dashboard is very clean, and the messaging system allowed me to clear all doubts with the landlord directly. Five stars!' },
            ].map((t, idx) => (
              <div key={idx} className="col-md-4">
                <div className="card h-100 border-0 glass-card p-4">
                  <p className="fst-italic text-secondary mb-4">"{t.quote}"</p>
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <h6 className="fw-bold m-0">{t.name}</h6>
                      <small className="text-muted">{t.role}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call To Action (CTA) */}
      <section
        className="py-5 text-white"
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, #172554 100%)',
        }}
      >
        <div className="container text-center py-4">
          <h2 className="fw-bold mb-3">Are You a Property Owner?</h2>
          <p className="lead mb-4 opacity-90 max-w-xl mx-auto">
            List your rental property with HouseHunt and reach verified tenants instantly. We offer secure messaging, booking requests, and easy management tools.
          </p>
          <Link to="/dashboard/properties" className="btn btn-light text-primary px-5 py-3 rounded-pill fw-bold shadow-md hover-scale">
            Add Your Property Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
