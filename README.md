# HouseHunt - "Find Your Perfect Home"

HouseHunt is a production-ready, modern, responsive, and secure House Rental Management System built on the MERN stack (MongoDB, Express, React, Node.js). Designed with a premium minimalist glassmorphic interface, it serves as an end-to-end platform for guests, registered users (tenants & landlords), and portal administrators.

---

## 🌟 Key Features

### Public Features (Guests)
- **Modern Hero Search**: Filter properties by keyword, city, rent pricing, bedroom/bathroom configurations, and type.
- **Glassmorphic Property Cards**: Inspect basic specifications (beds, baths, square feet, rent price, location) in dynamic grid layouts.
- **Detailed Pages**: View descriptive reviews, maps placeholders, amenities lists, owner contact profiles, and similar property lists.

### Registered User Features (Tenants & Landlords)
- **Profile Management**: Update phone numbers, bio details, addresses, and upload profile pictures.
- **Listings CRUD**: Add, edit, or delete listings with multi-image upload file pickers.
- **Secure Chat**: Direct inbox chats with landlords or tenants, integrated with system alerts.
- **Booking Manager**: Landlords approve or reject tenancy lease requests; tenants cancel active bookings.
- **Wishlist**: Save favorite listings to personal wishlists for quick bookings.

### Admin Dashboard Features
- **Platform Analytics**: Total users, total live/pending properties, lease counts, and monthly revenue trackers.
- **User Audits**: Lock, block, or reactivate platform user accounts.
- **Approval Queue**: Approve authentic submissions or remove spam postings.
- **Lease Oversight**: Audit and manage active bookings or contracts across the system.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, React Router DOM, Axios, Bootstrap 5, React Icons, Framer Motion, React Toastify, Context API.
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Multer, Express Validator, Helmet, Cookie Parser.
- **Database**: MongoDB, Mongoose ORM.

---

## 📂 Project Directory Structure

```
smartbridge/
├── server/                     # Express.js backend
│   ├── config/                 # DB connection configuration
│   ├── controllers/            # Auth, Property, Booking, Messages, Admin controllers
│   ├── middleware/             # Route safeguards, multer file uploads, error handlers
│   ├── models/                 # Mongoose schemas (User, Property, Booking, Favorite, Message)
│   ├── routes/                 # Express routing maps
│   ├── utils/                  # Database seeding script
│   └── server.js               # Main server listener config
└── client/                     # Vite + React.js frontend
    ├── public/                 # HTML templates and favicons
    └── src/
        ├── assets/             # Icons, default pictures
        ├── components/         # Reusable layouts, galleries, search forms
        ├── context/            # AuthContext provider
        ├── pages/              # Public screens, dashboards, admin portals
        └── App.jsx             # React routing entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed locally (v18+)
- MongoDB Community Server running locally on port `27017` (or access to MongoDB Atlas).

---

### Step 1: Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd server
   ```
2. Install all required dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables. The `.env` file is already created for local development with defaults:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/househunt
   JWT_SECRET=super_secret_key_12345_househunt
   JWT_EXPIRE=30d
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```
4. **Seed the database** to pre-populate sample data (Admins, Landlords, Renters, active properties, messaging logs, and reviews):
   ```bash
   node utils/seed.js
   ```
5. Start the backend developer server:
   ```bash
   npm run dev
   ```
   *The backend will boot up on `http://localhost:5000`.*

---

### Step 2: Frontend Setup
1. Open a new terminal window and navigate to the frontend folder:
   ```bash
   cd client
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Boot up the Vite developer environment:
   ```bash
   npm start
   ```
   *The frontend client will open on `http://localhost:5173`.*

---

## 🔑 Demo Account Credentials

Seeding the database creates the following accounts (all passwords are `password123`):

| Role | Email ID | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@househunt.com` | `password123` | Control users, approval queues, system settings |
| **Landlord / Owner** | `john@househunt.com` | `password123` | Add property listings, accept bookings, check chat inbox |
| **Landlord / Owner** | `alice@househunt.com` | `password123` | List flats, PG spaces |
| **Renter / Tenant** | `bob@househunt.com` | `password123` | Book properties, search, save favorites, message owners |
| **Renter / Tenant** | `emma@househunt.com` | `password123` | Browse rentals, chat with landlords |

---

## 🔒 Security Practices Configured
- **Password Hashing**: Cryptographic password hashing using `bcryptjs`.
- **Protected Endpoints**: Verified Route wrappers using JSON Web Tokens (JWT).
- **Helmet Headers**: Configured HTTP response headers for security protection.
- **CORS Protection**: Access verification limiting queries to registered client domains.
