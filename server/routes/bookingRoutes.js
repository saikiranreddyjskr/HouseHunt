const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getIncomingRequests,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Secure all booking routes

router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.get('/my-requests', getIncomingRequests);
router.put('/:id/status', updateBookingStatus);
router.delete('/:id', deleteBooking);

module.exports = router;
