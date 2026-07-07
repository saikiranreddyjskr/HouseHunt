const Property = require('../models/Property');
const Favorite = require('../models/Favorite');
const Notification = require('../models/Notification');

// @desc    Get all properties (with filtering, sorting, pagination)
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res, next) => {
  try {
    const queryObj = {};

    // For public requests, show only approved properties unless requested otherwise (by owner or admin)
    if (req.query.myProperties === 'true' && req.headers.authorization) {
      // Handled separately or filtered by owner below
    } else {
      queryObj.approved = true;
    }

    // Filters
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      queryObj.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { city: searchRegex },
        { state: searchRegex },
        { address: searchRegex },
      ];
    }

    if (req.query.city) {
      queryObj.city = new RegExp(req.query.city, 'i');
    }

    if (req.query.state) {
      queryObj.state = new RegExp(req.query.state, 'i');
    }

    if (req.query.propertyType) {
      queryObj.propertyType = req.query.propertyType;
    }

    if (req.query.bedrooms) {
      queryObj.bedrooms = Number(req.query.bedrooms);
    }

    if (req.query.bathrooms) {
      queryObj.bathrooms = Number(req.query.bathrooms);
    }

    if (req.query.furnished) {
      queryObj.furnished = req.query.furnished;
    }

    if (req.query.petFriendly) {
      queryObj.petFriendly = req.query.petFriendly === 'true';
    }

    if (req.query.parking) {
      queryObj.parking = req.query.parking === 'true';
    }

    if (req.query.minPrice || req.query.maxPrice) {
      queryObj.price = {};
      if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) queryObj.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.owner) {
      queryObj.owner = req.query.owner;
      // If retrieving owner's own properties, they don't have to be approved to see them
      delete queryObj.approved;
    }

    // Execute query
    let query = Property.find(queryObj).populate('owner', 'name email phone profilePicture');

    // Sorting
    if (req.query.sortBy) {
      const sortBy = req.query.sortBy;
      if (sortBy === 'lowestPrice') {
        query = query.sort({ price: 1 });
      } else if (sortBy === 'highestPrice') {
        query = query.sort({ price: -1 });
      } else if (sortBy === 'newest') {
        query = query.sort({ createdAt: -1 });
      } else {
        query = query.sort({ createdAt: -1 }); // Default to newest
      }
    } else {
      query = query.sort({ createdAt: -1 });
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;
    const startIndex = (page - 1) * limit;
    const total = await Property.countDocuments(queryObj);

    query = query.skip(startIndex).limit(limit);

    const properties = await query;

    res.status(200).json({
      success: true,
      count: properties.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalProperties: total,
      },
      properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name email phone profilePicture bio'
    );

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Registered User)
exports.createProperty = async (req, res, next) => {
  try {
    // Collect images if uploaded
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const propertyData = {
      ...req.body,
      owner: req.user.id,
      images: imageUrls,
      amenities: req.body.amenities ? (Array.isArray(req.body.amenities) ? req.body.amenities : req.body.amenities.split(',')) : [],
      approved: false, // Must be approved by admin
    };

    // Parse numeric fields
    if (propertyData.price) propertyData.price = Number(propertyData.price);
    if (propertyData.deposit) propertyData.deposit = Number(propertyData.deposit);
    if (propertyData.bedrooms) propertyData.bedrooms = Number(propertyData.bedrooms);
    if (propertyData.bathrooms) propertyData.bathrooms = Number(propertyData.bathrooms);
    if (propertyData.area) propertyData.area = Number(propertyData.area);
    if (propertyData.petFriendly) propertyData.petFriendly = propertyData.petFriendly === 'true' || propertyData.petFriendly === true;
    if (propertyData.parking) propertyData.parking = propertyData.parking === 'true' || propertyData.parking === true;

    const property = await Property.create(propertyData);

    // Create system notification for Admin
    // Find admins to notify
    const User = require('../models/User');
    const admins = await User.find({ role: 'admin' });
    for (let admin of admins) {
      await Notification.create({
        user: admin._id,
        type: 'property_approval',
        title: 'New Property Pending Approval',
        message: `Property "${property.title}" in ${property.city} was added by ${req.user.name} and requires approval.`,
        link: `/admin/properties`,
      });
    }

    res.status(201).json({
      success: true,
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Owner or Admin)
exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Make sure user is owner or admin
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this listing' });
    }

    // Collect new images if uploaded
    let imageUrls = [...property.images];
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      // If user wants to replace or append: append
      imageUrls = [...imageUrls, ...newImages];
    }

    // Support resetting images if provided
    if (req.body.clearExistingImages === 'true') {
      imageUrls = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];
    }

    const propertyData = {
      ...req.body,
      images: imageUrls,
      amenities: req.body.amenities ? (Array.isArray(req.body.amenities) ? req.body.amenities : req.body.amenities.split(',').map(a => a.trim())) : property.amenities,
    };

    // If edited, reset approved status unless the updater is admin
    if (req.user.role !== 'admin') {
      propertyData.approved = false;
    }

    // Parse numeric/boolean fields
    if (propertyData.price) propertyData.price = Number(propertyData.price);
    if (propertyData.deposit) propertyData.deposit = Number(propertyData.deposit);
    if (propertyData.bedrooms) propertyData.bedrooms = Number(propertyData.bedrooms);
    if (propertyData.bathrooms) propertyData.bathrooms = Number(propertyData.bathrooms);
    if (propertyData.area) propertyData.area = Number(propertyData.area);
    if (propertyData.petFriendly !== undefined) propertyData.petFriendly = propertyData.petFriendly === 'true' || propertyData.petFriendly === true;
    if (propertyData.parking !== undefined) propertyData.parking = propertyData.parking === 'true' || propertyData.parking === true;

    property = await Property.findByIdAndUpdate(req.params.id, propertyData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Owner or Admin)
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Make sure user is owner or admin
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
    }

    await Property.findByIdAndDelete(req.params.id);

    // Remove favorites linked to this property
    await Favorite.deleteMany({ property: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Property listing deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle property as favorite (save/unsave)
// @route   POST /api/properties/:id/favorite
// @access  Private
exports.toggleFavorite = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const favExists = await Favorite.findOne({
      user: req.user.id,
      property: req.params.id,
    });

    if (favExists) {
      await Favorite.findByIdAndDelete(favExists._id);
      res.status(200).json({
        success: true,
        favorited: false,
        message: 'Property removed from saved list',
      });
    } else {
      await Favorite.create({
        user: req.user.id,
        property: req.params.id,
      });
      res.status(200).json({
        success: true,
        favorited: true,
        message: 'Property saved to favorites',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get saved properties
// @route   GET /api/properties/favorites/all
// @access  Private
exports.getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).populate({
      path: 'property',
      populate: {
        path: 'owner',
        select: 'name email phone',
      },
    });

    // filter out null properties (in case property was deleted)
    const validFavorites = favorites.filter(fav => fav.property !== null);

    res.status(200).json({
      success: true,
      count: validFavorites.length,
      favorites: validFavorites,
    });
  } catch (error) {
    next(error);
  }
};
