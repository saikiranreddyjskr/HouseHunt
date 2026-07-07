import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiSettings, FiCheck } from 'react-icons/fi';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    autoApproveProperties: false,
    maxListingImages: 6,
    requirePhoneForBooking: true,
    maintenanceMode: false,
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettings({ ...settings, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Admin system settings saved successfully (Simulated).');
  };

  return (
    <div className="fade-in-up" style={{ maxWidth: '650px' }}>
      <div className="mb-4">
        <h3 className="fw-bold">Platform Configuration Settings</h3>
        <p className="text-secondary">Control website behavior, parameters, and global flags.</p>
      </div>

      <div className="card border-0 glass-card p-4">
        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
          <FiSettings className="text-primary" />
          <span>System Parameters</span>
        </h5>

        <form onSubmit={handleSave} className="d-flex flex-column gap-3.5">
          <div className="form-check form-switch p-3 rounded bg-light border d-flex justify-content-between align-items-center m-0">
            <div>
              <label className="form-check-label fw-bold text-sm text-dark d-block" htmlFor="autoApprove">
                Auto-approve property listings
              </label>
              <small className="text-muted text-xs">If enabled, new property submissions bypass admin approval queue.</small>
            </div>
            <input
              className="form-check-input ms-0"
              type="checkbox"
              id="autoApprove"
              name="autoApproveProperties"
              checked={settings.autoApproveProperties}
              onChange={handleChange}
            />
          </div>

          <div className="form-check form-switch p-3 rounded bg-light border d-flex justify-content-between align-items-center m-0">
            <div>
              <label className="form-check-label fw-bold text-sm text-dark d-block" htmlFor="requirePhone">
                Require phone number for bookings
              </label>
              <small className="text-muted text-xs">Enforces tenants to add contact numbers before requesting rentals.</small>
            </div>
            <input
              className="form-check-input ms-0"
              type="checkbox"
              id="requirePhone"
              name="requirePhoneForBooking"
              checked={settings.requirePhoneForBooking}
              onChange={handleChange}
            />
          </div>

          <div className="form-check form-switch p-3 rounded bg-light border d-flex justify-content-between align-items-center m-0">
            <div>
              <label className="form-check-label fw-bold text-sm text-dark d-block" htmlFor="maintenance">
                System Maintenance Mode
              </label>
              <small className="text-muted text-xs">Locks property uploads and bookings. Displays maintenance message.</small>
            </div>
            <input
              className="form-check-input ms-0"
              type="checkbox"
              id="maintenance"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
            />
          </div>

          <div className="border-top pt-3" style={{ borderColor: 'var(--border-color)' }}>
            <label className="form-label text-sm fw-semibold text-secondary">Maximum Listing Images Upload Limit</label>
            <input
              type="number"
              className="form-control"
              name="maxListingImages"
              value={settings.maxListingImages}
              onChange={handleChange}
              min="1"
              max="20"
              style={{ maxWidth: '150px' }}
            />
          </div>

          <button type="submit" className="btn btn-primary rounded-3 py-2.5 fw-bold mt-3 align-self-start px-4 d-flex align-items-center gap-1.5">
            <FiCheck size={18} />
            <span>Save System Settings</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
