import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiMail, FiPhone, FiMapPin, FiTwitter, FiFacebook, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="pt-5 pb-4 mt-auto" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
      <div className="container">
        <div className="row g-4 justify-content-between">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center mb-3 text-gradient">
              <FiHome size={28} className="me-2" style={{ color: 'var(--primary)' }} />
              <span className="fw-bold fs-4">HouseHunt</span>
            </div>
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
              HouseHunt is the premier rental management platform designed to help you find your perfect home or list your listings with ease. Discover luxury apartments, cozy studio rooms, and beautiful villas.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="btn btn-outline-primary btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <FiTwitter size={16} />
              </a>
              <a href="#" className="btn btn-outline-primary btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <FiFacebook size={16} />
              </a>
              <a href="#" className="btn btn-outline-primary btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <FiInstagram size={16} />
              </a>
              <a href="#" className="btn btn-outline-primary btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <FiLinkedin size={16} />
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h5 className="mb-3 fw-bold">Quick Links</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to="/" className="text-decoration-none text-secondary-hover" style={{ color: 'var(--text-secondary)' }}>Home</Link></li>
              <li><Link to="/properties" className="text-decoration-none text-secondary-hover" style={{ color: 'var(--text-secondary)' }}>Properties</Link></li>
              <li><Link to="/about" className="text-decoration-none text-secondary-hover" style={{ color: 'var(--text-secondary)' }}>About Us</Link></li>
              <li><Link to="/contact" className="text-decoration-none text-secondary-hover" style={{ color: 'var(--text-secondary)' }}>Contact</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h5 className="mb-3 fw-bold">Legal</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to="/privacy-policy" className="text-decoration-none text-secondary-hover" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-decoration-none text-secondary-hover" style={{ color: 'var(--text-secondary)' }}>Terms of Service</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="mb-3 fw-bold">Contact Info</h5>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li className="d-flex align-items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                <FiMapPin size={20} className="text-primary mt-1 flex-shrink-0" />
                <span>123 Elite Residency, Electronic City, Bangalore, India</span>
              </li>
              <li className="d-flex align-items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <FiPhone size={18} className="text-primary flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="d-flex align-items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <FiMail size={18} className="text-primary flex-shrink-0" />
                <span>support@househunt.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />

        <div className="row">
          <div className="col-md-12 text-center">
            <p className="mb-0 text-sm" style={{ color: 'var(--text-muted)' }}>
              &copy; {new Date().getFullYear()} HouseHunt. All Rights Reserved. Crafted with ❤️ for final year engineering project.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
