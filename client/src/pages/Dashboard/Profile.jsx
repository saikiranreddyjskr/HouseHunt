import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { SERVER_URL } from '../../utils/api';
import { toast } from 'react-toastify';
import { FiUser, FiPhone, FiMapPin, FiInfo, FiLock } from 'react-icons/fi';

const Profile = () => {
  const { user, updateProfile, changePassword } = useContext(AuthContext);

  // Profile Edit State
  const [profileData, setProfileData] = useState({
    name: user ? user.name : '',
    phone: user ? user.phone : '',
    address: user ? user.address : '',
    bio: user ? user.bio : '',
  });
  const [profilePic, setProfilePic] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.name) {
      toast.warning('Name is required.');
      return;
    }

    setProfileLoading(true);
    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('phone', profileData.phone);
    formData.append('address', profileData.address);
    formData.append('bio', profileData.bio);
    if (profilePic) {
      formData.append('profilePicture', profilePic);
    }

    const res = await updateProfile(formData);
    setProfileLoading(false);

    if (res && res.success) {
      toast.success('Profile details updated successfully!');
      setProfilePic(null);
    } else {
      toast.error(res?.message || 'Failed to update profile.');
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword) {
      toast.warning('Please enter all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      toast.warning('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    const res = await changePassword(currentPassword, newPassword);
    setPasswordLoading(false);

    if (res && res.success) {
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast.error(res?.message || 'Failed to change password.');
    }
  };

  return (
    <div className="fade-in-up">
      <div className="mb-4">
        <h3 className="fw-bold">My Profile Settings</h3>
        <p className="text-secondary">Update your personal account credentials, profile photo, and security password.</p>
      </div>

      <div className="row g-4">
        {/* Left Column: Edit Details */}
        <div className="col-lg-7">
          <div className="card border-0 glass-card p-4 h-100">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <FiUser className="text-primary" />
              <span>Personal Details</span>
            </h5>

            <form onSubmit={handleProfileSubmit} className="d-flex flex-column gap-3.5">
              {/* Profile Photo Display */}
              <div className="d-flex align-items-center gap-4 mb-2">
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: '80px', height: '80px', fontSize: '2rem', border: '2px solid var(--border-color)' }}
                >
                  {user.profilePicture ? (
                    <img
                      src={` ${SERVER_URL}${user.profilePicture}`}
                      alt="Current profile pic"
                      className="rounded-circle w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    user.name[0]
                  )}
                </div>
                <div>
                  <label className="form-label text-sm fw-semibold text-secondary m-0 mb-1 d-block">Change Photo</label>
                  <input
                    type="file"
                    className="form-control text-sm"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <small className="text-muted mt-1 d-block">Accepted formats: JPG, PNG, WEBP. Max size: 5MB</small>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-sm fw-semibold text-secondary">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-sm fw-semibold text-secondary">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-sm fw-semibold text-secondary">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                />
              </div>

              <div>
                <label className="form-label text-sm fw-semibold text-secondary">Bio / Tagline</label>
                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Tell tenants or owners about yourself..."
                  name="bio"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary rounded-3 py-2 fw-semibold align-self-start px-4" disabled={profileLoading}>
                {profileLoading ? 'Saving...' : 'Save Profile Details'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Change Password */}
        <div className="col-lg-5">
          <div className="card border-0 glass-card p-4 mb-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <FiLock className="text-primary" />
              <span>Change Password</span>
            </h5>

            <form onSubmit={handlePasswordSubmit} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label text-sm fw-semibold text-secondary">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="currentPassword"
                  placeholder="••••••"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div>
                <label className="form-label text-sm fw-semibold text-secondary">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="newPassword"
                  placeholder="••••••"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div>
                <label className="form-label text-sm fw-semibold text-secondary">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  placeholder="••••••"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-gradient-primary rounded-3 py-2 fw-semibold mt-2" disabled={passwordLoading}>
                {passwordLoading ? 'Updating password...' : 'Update Password'}
              </button>
            </form>
          </div>

          <div className="card border-0 glass-card p-4 text-secondary text-sm">
            <h6 className="fw-bold d-flex align-items-center gap-2 mb-2 text-dark">
              <FiInfo className="text-primary" />
              <span>Role Permissions</span>
            </h6>
            <p className="m-0 lh-lg">
              Your account is registered as: <strong>{user.role === 'admin' ? 'Administrator' : 'Standard User (Tenant/Landlord)'}</strong>. You have permissions to browse, bookmark, message, list properties, and create bookings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
