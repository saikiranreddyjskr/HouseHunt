const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a property title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a monthly rent price'],
    },
    deposit: {
      type: Number,
      required: [true, 'Please add a security deposit amount'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please specify the number of bedrooms'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please specify the number of bathrooms'],
    },
    area: {
      type: Number,
      required: [true, 'Please specify the area in square feet'],
    },
    propertyType: {
      type: String,
      required: [true, 'Please specify the property type'],
      enum: ['Apartment', 'Villa', 'Independent House', 'PG', 'Hostel', 'Commercial'],
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    city: {
      type: String,
      required: [true, 'Please add a city'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Please add a state'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'Please add a pincode'],
    },
    amenities: {
      type: [String],
      default: [],
    },
    furnished: {
      type: String,
      enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
      default: 'Unfurnished',
    },
    petFriendly: {
      type: Boolean,
      default: false,
    },
    parking: {
      type: Boolean,
      default: false,
    },
    availableFrom: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Available', 'Rented', 'Maintenance'],
      default: 'Available',
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Property', PropertySchema);
