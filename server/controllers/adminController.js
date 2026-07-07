const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    const pendingApprovals = await Property.countDocuments({ approved: false });
    const approvedListings = await Property.countDocuments({ approved: true });

    // Calculate revenue (Sum of prices of Approved bookings)
    const paidBookings = await Booking.find({ status: 'Approved' }).populate('property', 'price');
    const totalRevenue = paidBookings.reduce((sum, booking) => {
      return sum + (booking.property ? booking.property.price : 0);
    }, 0);

    // Recently added properties
    const recentProperties = await Property.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recently registered users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Property types breakdown
    const typesBreakdown = await Property.aggregate([
      { $group: { _id: '$propertyType', count: { $sum: 1 } } },
    ]);

    // Top cities breakdown
    const citiesBreakdown = await Property.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalProperties,
        totalBookings,
        pendingApprovals,
        approvedListings,
        totalRevenue,
        recentProperties,
        recentUsers,
        typesBreakdown,
        citiesBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Block or Unblock user
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { isBlocked } = req.body;

    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot block/unblock yourself!' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isBlocked = isBlocked;
    await user.save();

    // Create system notification for that user
    await Notification.create({
      user: user._id,
      type: 'system',
      title: isBlocked ? 'Account Blocked' : 'Account Re-activated',
      message: isBlocked
        ? 'Your account has been suspended by the Administrator due to policy violations.'
        : 'Your account has been reactivated by the Administrator. You can now login.',
    });

    res.status(200).json({
      success: true,
      message: `User account has been ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties (both approved and pending)
// @route   GET /api/admin/properties
// @access  Private (Admin only)
exports.getProperties = async (req, res, next) => {
  try {
    const properties = await Property.find()
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or Reject property listing
// @route   PUT /api/admin/properties/:id/approve
// @access  Private (Admin only)
exports.approveProperty = async (req, res, next) => {
  try {
    const { approve } = req.body; // true or false

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    property.approved = approve;
    await property.save();

    // Notify property owner
    await Notification.create({
      user: property.owner,
      type: 'property_approval',
      title: approve ? 'Listing Approved!' : 'Listing Rejected',
      message: approve
        ? `Your property listing "${property.title}" has been approved and is now live on the search page.`
        : `Your property listing "${property.title}" was rejected. Please review details and resubmit.`,
      link: '/dashboard/properties',
    });

    res.status(200).json({
      success: true,
      message: `Property listing was ${approve ? 'approved' : 'unapproved'} successfully`,
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings in system
// @route   GET /api/admin/bookings
// @access  Private (Admin only)
exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate({
        path: 'property',
        select: 'title price city owner',
        populate: {
          path: 'owner',
          select: 'name email',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};
