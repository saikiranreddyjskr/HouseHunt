const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Secure all notification routes

router.get('/', getNotifications);
router.put('/mark-read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
