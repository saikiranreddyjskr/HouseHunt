const Booking = require('../models/Booking');
const Property = require('../models/Property');
const Notification = require('../models/Notification');

// @desc    Create a new booking request
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { propertyId, moveInDate, duration } = req.body;

    if (!propertyId || !moveInDate || !duration) {
      return res.status(400).json({ success: false, message: 'Please provide property ID, move-in date and duration' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (!property.approved) {
      return res.status(400).json({ success: false, message: 'This property has not been approved by the Admin yet' });
    }

    if (property.status !== 'Available') {
      return res.status(400).json({ success: false, message: 'This property is not available for booking' });
    }

    if (property.owner.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot book your own property' });
    }

    // Check if user already has a pending/approved booking for this property
    const existingBooking = await Booking.findOne({
      user: req.user.id,
      property: propertyId,
      status: { $in: ['Pending', 'Approved'] },
    });

    if (existingBooking) {
      return res.status(400).json({ success: false, message: 'You already have a pending or active booking for this property' });
    }

    const booking = await Booking.create({
      user: req.user.id,
      property: propertyId,
      moveInDate,
      duration: Number(duration),
      status: 'Pending',
      paymentStatus: 'Pending',
    });

    // Notify the property owner
    await Notification.create({
      user: property.owner,
      type: 'booking_request',
      title: 'New Booking Request',
      message: `${req.user.name} has requested to rent your property "${property.title}" starting ${new Date(moveInDate).toLocaleDateString()}.`,
      link: `/dashboard/bookings`,
    });

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings made by the current user
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'property',
        populate: {
          path: 'owner',
          select: 'name email phone profilePicture',
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

// @desc    Get incoming bookings requests for properties owned by current user
// @route   GET /api/bookings/my-requests
// @access  Private
exports.getIncomingRequests = async (req, res, next) => {
  try {
    // Find all properties owned by current user
    const myProperties = await Property.find({ owner: req.user.id });
    const propertyIds = myProperties.map((p) => p._id);

    const bookings = await Booking.find({ property: { $in: propertyIds } })
      .populate('user', 'name email phone profilePicture')
      .populate('property', 'title price city')
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

// @desc    Accept or Reject a booking request
// @route   PUT /api/bookings/:id/status
// @access  Private (Property Owner)
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // Approved or Rejected

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status' });
    }

    const booking = await Booking.findById(req.params.id).populate('property');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking request not found' });
    }

    // Verify req.user is the owner of the property
    if (booking.property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to approve/reject bookings for this property' });
    }

    booking.status = status;

    if (status === 'Approved') {
      booking.paymentStatus = 'Paid'; // Simulate payment success
      // Mark property as Rented
      await Property.findByIdAndUpdate(booking.property._id, { status: 'Rented' });

      // Reject all other pending bookings for the same property
      await Booking.updateMany(
        {
          property: booking.property._id,
          _id: { $ne: booking._id },
          status: 'Pending',
        },
        { status: 'Rejected' }
      );
    }

    await booking.save();

    // Notify the tenant
    await Notification.create({
      user: booking.user,
      type: 'booking_status',
      title: `Booking Request ${status}`,
      message: `Your booking request for "${booking.property.title}" has been ${status.toLowerCase()}${status === 'Approved' ? '! View details to check move-in information.' : '.'}`,
      link: `/dashboard/bookings`,
    });

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel/delete booking request
// @route   DELETE /api/bookings/:id
// @access  Private (Renter who booked, Owner or Admin)
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('property');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking record not found' });
    }

    // Check permissions (tenant, owner, or admin)
    const isTenant = booking.user.toString() === req.user.id;
    const isOwner = booking.property.owner.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isTenant && !isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    // If booking was approved and is cancelled, make property available again
    if (booking.status === 'Approved') {
      await Property.findByIdAndUpdate(booking.property._id, { status: 'Available' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    // Create system notification for other party
    const notifyTarget = isTenant ? booking.property.owner : booking.user;
    await Notification.create({
      user: notifyTarget,
      type: 'booking_status',
      title: 'Booking Cancelled',
      message: `The booking for property "${booking.property.title}" has been cancelled by the ${isTenant ? 'tenant' : 'owner'}.`,
      link: `/dashboard/bookings`,
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};
