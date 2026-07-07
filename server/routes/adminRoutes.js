const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getUsers,
  updateUserStatus,
  getProperties,
  approveProperty,
  getBookings,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin')); // Only admins can access these endpoints

router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/properties', getProperties);
router.put('/properties/:id/approve', approveProperty);
router.get('/bookings', getBookings);

module.exports = router;
