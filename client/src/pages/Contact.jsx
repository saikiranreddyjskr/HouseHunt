import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.warning('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success('Your message has been sent! We will get back to you shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container py-5 fade-in-up" style={{ marginTop: '80px' }}>
      <div className="text-center mb-5 max-w-2xl mx-auto">
        <span className="text-primary fw-bold text-uppercase tracking-wider">Contact Us</span>
        <h2 className="fw-bold mt-1">We’d Love to Hear From You</h2>
        <p className="text-secondary mt-3">
          Have questions about a property listing, account registration, or need general assistance? Drop us a line below.
        </p>
      </div>

      <div className="row g-4">
        {/* Contact Info Details */}
        <div className="col-lg-5 col-md-6">
          <div className="card h-100 border-0 glass-card p-4">
            <h4 className="fw-bold mb-4">Contact Information</h4>

            <div className="d-flex flex-column gap-4">
              <div className="d-flex align-items-start gap-3">
                <div className="bg-light rounded-3 p-3 text-primary flex-shrink-0" style={{ border: '1px solid var(--border-color)' }}>
                  <FiMapPin size={24} />
                </div>
                <div>
                  <h6 className="fw-bold m-0 fs-5">Our Office Address</h6>
                  <p className="text-secondary mt-1 mb-0">123 Elite Residency, Electronic City, Bangalore, India</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="bg-light rounded-3 p-3 text-primary flex-shrink-0" style={{ border: '1px solid var(--border-color)' }}>
                  <FiPhone size={24} />
                </div>
                <div>
                  <h6 className="fw-bold m-0 fs-5">Phone Number</h6>
                  <p className="text-secondary mt-1 mb-0">+91 98765 43210</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="bg-light rounded-3 p-3 text-primary flex-shrink-0" style={{ border: '1px solid var(--border-color)' }}>
                  <FiMail size={24} />
                </div>
                <div>
                  <h6 className="fw-bold m-0 fs-5">Email Address</h6>
                  <p className="text-secondary mt-1 mb-0">support@househunt.com</p>
                </div>
              </div>
            </div>

            {/* Embed small static map */}
            <div className="rounded-3 overflow-hidden border mt-4 flex-grow-1" style={{ minHeight: '160px' }}>
              <iframe
                title="Office location map"
                src="https://maps.google.com/maps?q=Electronic%20City%20Bangalore&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '160px' }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="col-lg-7 col-md-6">
          <div className="card h-100 border-0 glass-card p-4">
            <h4 className="fw-bold mb-4">Send a Message</h4>

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-sm fw-semibold text-secondary">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="John Doe"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-sm fw-semibold text-secondary">Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="john@example.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-sm fw-semibold text-secondary">Subject</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="How can we help you?"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="form-label text-sm fw-semibold text-secondary">Message *</label>
                <textarea
                  rows="5"
                  className="form-control"
                  placeholder="Type your message content here..."
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-gradient-primary rounded-3 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2" disabled={loading}>
                <FiSend size={16} />
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
