const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Favorite = require('../models/Favorite');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database for seeding...');

    // Clear old data
    await User.deleteMany();
    await Property.deleteMany();
    await Booking.deleteMany();
    await Favorite.deleteMany();
    await Message.deleteMany();
    await Notification.deleteMany();

    console.log('Database cleared.');

    // 1. Create Users
    // Admin
    const admin = new User({
      name: 'Admin HouseHunt',
      email: 'admin@househunt.com',
      password: 'password123',
      phone: '9999999999',
      role: 'admin',
      profilePicture: '',
      address: 'Admin HQ, Central City',
      bio: 'System Administrator for HouseHunt portal.',
    });
    await admin.save();

    // Owners
    const owner1 = new User({
      name: 'John Doe (Owner)',
      email: 'john@househunt.com',
      password: 'password123',
      phone: '9876543210',
      role: 'user',
      profilePicture: '',
      address: 'Green Meadows, Bangalore',
      bio: 'Real estate investor and property owner. I love renting out quality homes.',
    });
    await owner1.save();

    const owner2 = new User({
      name: 'Alice Smith (Owner)',
      email: 'alice@househunt.com',
      password: 'password123',
      phone: '8765432109',
      role: 'user',
      profilePicture: '',
      address: 'Skyline Towers, Mumbai',
      bio: 'Managing agent for luxury villas and modern apartments.',
    });
    await owner2.save();

    // Tenants
    const tenant1 = new User({
      name: 'Bob Johnson (Tenant)',
      email: 'bob@househunt.com',
      password: 'password123',
      phone: '7654321098',
      role: 'user',
      profilePicture: '',
      address: 'Cozy Corner, Pune',
      bio: 'Software engineer looking for quiet apartments near tech hubs.',
    });
    await tenant1.save();

    const tenant2 = new User({
      name: 'Emma Watson (Tenant)',
      email: 'emma@househunt.com',
      password: 'password123',
      phone: '6543210987',
      role: 'user',
      profilePicture: '',
      address: 'Heritage Villa, Delhi',
      bio: 'Student searching for shared PG accommodations or single studio flats.',
    });
    await tenant2.save();

    console.log('Users seeded.');

    // 2. Create Properties
    const properties = [
      {
        title: 'Modern Luxury 2BHK Apartment',
        description: 'A spacious and beautifully designed 2BHK apartment in the heart of Electronic City. Fully furnished with high-end appliances, modular kitchen, power backup, and round-the-clock security. Access to common amenities like gymnasium and swimming pool.',
        price: 25000,
        deposit: 75000,
        owner: owner1._id,
        images: [],
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        propertyType: 'Apartment',
        address: 'Phase 1, Electronic City, Bangalore',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560100',
        amenities: ['WiFi', 'Parking', 'AC', 'Gym', 'Pool', 'Security', 'Power Backup'],
        furnished: 'Furnished',
        petFriendly: true,
        parking: true,
        status: 'Available',
        approved: true,
      },
      {
        title: 'Premium 3BHK Independent Villa',
        description: 'An elegant 3BHK villa with a private garden, terrace, and modular kitchen. Located in a premium gated community with lush greenery. Ideal for families looking for quiet, peaceful living. Safe and kid-friendly atmosphere.',
        price: 65000,
        deposit: 200000,
        owner: owner1._id,
        images: [],
        bedrooms: 3,
        bathrooms: 3,
        area: 2800,
        propertyType: 'Villa',
        address: 'Gated Villa Complex, Whitefield',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560066',
        amenities: ['Parking', 'AC', 'Gym', 'Security', 'Private Garden', 'Terrace'],
        furnished: 'Semi-Furnished',
        petFriendly: true,
        parking: true,
        status: 'Available',
        approved: true,
      },
      {
        title: 'Cozy PG Room for Rent near Metro',
        description: 'Single and sharing rooms available for male students and young professionals. Home-style food provided thrice a day. Laundry, high-speed WiFi, hot water, and housekeeping included. Very close to the metro station.',
        price: 8500,
        deposit: 15000,
        owner: owner2._id,
        images: [],
        bedrooms: 1,
        bathrooms: 1,
        area: 200,
        propertyType: 'PG',
        address: 'Karol Bagh Near Metro Stn',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110005',
        amenities: ['WiFi', 'Security', 'Housekeeping', 'Food Included', 'Hot Water'],
        furnished: 'Furnished',
        petFriendly: false,
        parking: false,
        status: 'Available',
        approved: true,
      },
      {
        title: 'Semi-Furnished Studio Apartment',
        description: 'Charming studio apartment perfect for couples or single renters. Situated in a safe, upscale neighborhood. Low maintenance costs, walk-in closets, and ample natural lighting.',
        price: 18000,
        deposit: 40000,
        owner: owner2._id,
        images: [],
        bedrooms: 1,
        bathrooms: 1,
        area: 550,
        propertyType: 'Apartment',
        address: 'Bandra West Road 3',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        amenities: ['WiFi', 'AC', 'Security'],
        furnished: 'Semi-Furnished',
        petFriendly: false,
        parking: true,
        status: 'Rented', // Simulates a rented property
        approved: true,
      },
      {
        title: 'Commercial Office Space in IT Hub',
        description: 'Unfurnished ready-to-move commercial office space for startups or small firms. Glass partitions, conference rooms setup, separate server room, pantry, and clean washrooms.',
        price: 110000,
        deposit: 500000,
        owner: owner2._id,
        images: [],
        bedrooms: 4,
        bathrooms: 2,
        area: 3200,
        propertyType: 'Commercial',
        address: 'Cyber City Sector 24',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '122002',
        amenities: ['WiFi', 'Parking', 'AC', 'Security', 'Power Backup', 'Pantry'],
        furnished: 'Unfurnished',
        petFriendly: false,
        parking: true,
        status: 'Available',
        approved: false, // Pending Admin Approval
      },
      {
        title: 'Independent 1BHK House with Terrace',
        description: 'First floor 1BHK portion of an independent house. Separate electricity meter, 24 hours corporation water, overhead tank, and a spacious private open terrace. Centrally located.',
        price: 12000,
        deposit: 50000,
        owner: owner1._id,
        images: [],
        bedrooms: 1,
        bathrooms: 1,
        area: 700,
        propertyType: 'Independent House',
        address: 'Jayanagar 4th Block',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560011',
        amenities: ['Parking', 'Terrace'],
        furnished: 'Unfurnished',
        petFriendly: true,
        parking: true,
        status: 'Available',
        approved: false, // Pending Admin Approval
      },
    ];

    const seededProperties = await Property.insertMany(properties);
    console.log('Properties seeded.');

    // 3. Create Bookings
    const bookings = [
      {
        user: tenant1._id,
        property: seededProperties[0]._id, // 2BHK Apartment
        moveInDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // In 15 days
        duration: 11, // 11 Months
        status: 'Pending',
        paymentStatus: 'Pending',
      },
      {
        user: tenant2._id,
        property: seededProperties[3]._id, // Studio Apartment
        moveInDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Started 5 days ago
        duration: 6,
        status: 'Approved',
        paymentStatus: 'Paid',
      },
    ];

    await Booking.insertMany(bookings);
    console.log('Bookings seeded.');

    // 4. Create Messages
    const messages = [
      {
        sender: tenant1._id,
        receiver: owner1._id,
        property: seededProperties[0]._id,
        message: 'Hello, is this apartment available immediately? I would like to visit it this weekend.',
      },
      {
        sender: owner1._id,
        receiver: tenant1._id,
        property: seededProperties[0]._id,
        message: 'Hi Bob, yes! The apartment is available. You can visit this Saturday around 11:00 AM. Let me know if that works.',
      },
      {
        sender: tenant1._id,
        receiver: owner1._id,
        property: seededProperties[0]._id,
        message: 'Saturday 11:00 AM works perfectly. See you then! Thanks.',
      },
    ];

    await Message.insertMany(messages);
    console.log('Messages seeded.');

    // 5. Create Favorites
    await Favorite.create({
      user: tenant1._id,
      property: seededProperties[0]._id,
    });
    await Favorite.create({
      user: tenant1._id,
      property: seededProperties[2]._id,
    });

    // 6. Create Notifications
    await Notification.create({
      user: admin._id,
      type: 'property_approval',
      title: 'New Property Pending Approval',
      message: 'Independent 1BHK House with Terrace was added by John Doe and requires review.',
      link: '/admin/properties',
    });

    await Notification.create({
      user: owner1._id,
      type: 'booking_request',
      title: 'New Booking Request',
      message: 'Bob Johnson has requested to book your Modern Luxury 2BHK Apartment.',
      link: '/dashboard/bookings',
    });

    await Notification.create({
      user: tenant2._id,
      type: 'booking_status',
      title: 'Booking Request Approved',
      message: 'Your booking request for Semi-Furnished Studio Apartment has been approved! Deposit payment received.',
      link: '/dashboard/bookings',
    });

    console.log('Notifications seeded.');
    console.log('All sample data successfully seeded!');
    process.exit();
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
