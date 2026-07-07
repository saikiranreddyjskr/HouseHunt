const express = require('express');
const router = express.Router();
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  toggleFavorite,
  getFavorites,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getProperties);
router.post('/', protect, upload.array('images', 6), createProperty);

router.get('/favorites/all', protect, getFavorites);
router.post('/:id/favorite', protect, toggleFavorite);

router.get('/:id', getProperty);
router.put('/:id', protect, upload.array('images', 6), updateProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router;
