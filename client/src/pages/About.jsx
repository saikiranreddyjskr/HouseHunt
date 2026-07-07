import React from 'react';
import { FiUsers, FiLock, FiThumbsUp, FiCheckCircle } from 'react-icons/fi';

const About = () => {
  return (
    <div className="container py-5 fade-in-up" style={{ marginTop: '80px' }}>
      {/* Introduction Header */}
      <div className="text-center mb-5 max-w-2xl mx-auto">
        <span className="text-primary fw-bold text-uppercase tracking-wider">About Us</span>
        <h2 className="fw-bold mt-1">Our Mission is to Find You the Best Place to Call Home</h2>
        <p className="text-secondary mt-3">
          HouseHunt was founded with a simple vision: to make renting properties hassle-free, secure, and fully transparent for both tenants and landlords.
        </p>
      </div>

      {/* Showcase Grid */}
      <div className="row g-4 mb-5 align-items-center">
        <div className="col-lg-6">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
            alt="Real estate deals"
            className="w-100 rounded-4 shadow-sm object-fit-cover"
            style={{ height: '350px' }}
          />
        </div>
        <div className="col-lg-6">
          <h3 className="fw-bold mb-3">Redefining Rental Housing Systems</h3>
          <p className="text-secondary lh-lg mb-4">
            Traditional renting is full of complex procedures, unverified listings, and lack of direct communication. At HouseHunt, we resolve these challenges by offering a centralized dashboard, role-based authorization (Tenants, Owners, Admins), real-time messaging, and admin listing reviews to maintain high quality control.
          </p>
          <ul className="list-unstyled d-flex flex-column gap-2">
            <li className="d-flex align-items-center gap-2 fw-medium text-secondary">
              <FiCheckCircle className="text-success" /> Fully Verified Property Listings
            </li>
            <li className="d-flex align-items-center gap-2 fw-medium text-secondary">
              <FiCheckCircle className="text-success" /> Secure Chat with Landlords Direct
            </li>
            <li className="d-flex align-items-center gap-2 fw-medium text-secondary">
              <FiCheckCircle className="text-success" /> Role-Based Secure Accounts
            </li>
            <li className="d-flex align-items-center gap-2 fw-medium text-secondary">
              <FiCheckCircle className="text-success" /> Beautiful, Modern, responsive UI Design
            </li>
          </ul>
        </div>
      </div>

      {/* Core Values */}
      <div className="text-center mb-5 border-top pt-5" style={{ borderColor: 'var(--border-color)' }}>
        <h3 className="fw-bold mb-4">Our Core Values</h3>
        <div className="row g-4 justify-content-center">
          <div className="col-md-4">
            <div className="card h-100 border-0 glass-card p-4">
              <div className="bg-light rounded-circle p-3 d-inline-block mb-3" style={{ color: 'var(--primary)' }}>
                <FiUsers size={28} />
              </div>
              <h5 className="fw-bold">User-Centric</h5>
              <p className="text-secondary mb-0">We focus on building a premium user experience with simple tools that make rental searching effortless.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 glass-card p-4">
              <div className="bg-light rounded-circle p-3 d-inline-block mb-3" style={{ color: 'var(--primary)' }}>
                <FiLock size={28} />
              </div>
              <h5 className="fw-bold">Security & Trust</h5>
              <p className="text-secondary mb-0">Admin approval on every listing ensures you browse only verified properties without fake postings.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 glass-card p-4">
              <div className="bg-light rounded-circle p-3 d-inline-block mb-3" style={{ color: 'var(--primary)' }}>
                <FiThumbsUp size={28} />
              </div>
              <h5 className="fw-bold">Transparency</h5>
              <p className="text-secondary mb-0">Direct communication tools connect users directly to the house owners. No middle-man fees.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
