# AirBnb Clone

A full-stack web application that replicates the core functionality of Airbnb, built with Node.js, Express, MongoDB, and EJS templating.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [File Upload](#file-upload)
- [Authentication](#authentication)
- [Booking System](#booking-system)
- [Contributing](#contributing)

## ✨ Features

### User Authentication
- User signup and login with email/password
- Password hashing using bcryptjs
- Session-based authentication with MongoDB session store
- Guest and Host user types

### Guest Features
- Browse all available homes with images, location, price, and rating
- View detailed home information
- Add/remove homes to/from favorites
- Book homes with date range and guest count
- View booking history and cancel bookings

### Host Features
- Create new property listings
- Upload property photos
- Edit property details
- Delete property listings
- View incoming bookings

### Booking System
- Book homes with date picker
- Automatic price calculation based on number of nights
- Booking status tracking (confirmed/cancelled)
- Cancel bookings with status updates
- Booking history with all details

### Favorites System
- Add homes to favorites list
- Remove homes from favorites
- View complete favorites list
- Persistent storage using MongoDB

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** (v5.2.1) - Web framework
- **MongoDB** - NoSQL database (Atlas Cloud)
- **Mongoose** (v9.6.3) - MongoDB ODM
- **Express-Session** - Session management
- **Multer** (v2.1.1) - File upload handling
- **Bcryptjs** (v3.0.3) - Password hashing
- **Express-Validator** (v7.3.2) - Input validation
- **dotenv** - Environment variables

### Frontend
- **EJS** - Templating engine
- **Tailwind CSS** - Utility-first CSS framework
- **HTML5** - Markup language
- **JavaScript** - Client-side scripting
- **PostCSS** - CSS processing
- **SVG Icons** - Lightweight, scalable icons
- **CSS Animations** - Smooth transitions and effects

### Database
- **MongoDB Atlas** - Cloud database service
- **Connect-MongoDB-Session** - Session store

## 📁 Project Structure

```
AirBnb_clone/
├── AirBnb/
│   ├── backend/
│   │   ├── Controllers/
│   │   │   ├── authController.js      # Authentication logic
│   │   │   ├── storeController.js     # Guest operations
│   │   │   ├── hostController.js      # Host operations
│   │   │   ├── bookingController.js   # Booking logic
│   │   │   └── error.js               # Error handling
│   │   ├── models/
│   │   │   ├── user.js                # User schema
│   │   │   ├── home.js                # Home/Property schema
│   │   │   └── booking.js             # Booking schema
│   │   ├── Routes/
│   │   │   ├── authRouter.js          # Auth routes
│   │   │   ├── storeRouter.js         # Guest routes
│   │   │   └── hostRouter.js          # Host routes
│   │   ├── utils/
│   │   │   └── pathUtil.js            # Path utilities
│   │   ├── app.js                     # Express server
│   │   ├── package.json               # Dependencies
│   │   ├── .env                       # Environment variables
│   │   └── .gitignore                 # Git ignore rules
│   ├── frontend/
│   │   ├── views/
│   │   │   ├── store/
│   │   │   │   ├── index.ejs          # Homepage
│   │   │   │   ├── home-list.ejs      # Browse homes
│   │   │   │   ├── home-detail.ejs    # Home details
│   │   │   │   ├── reserve.ejs        # Booking form
│   │   │   │   ├── bookings.ejs       # My bookings
│   │   │   │   └── favourite-list.ejs # Favorites page
│   │   │   ├── host/
│   │   │   │   ├── host-home-list.ejs # Host listings
│   │   │   │   └── edit-home.ejs      # Edit property
│   │   │   ├── auth/
│   │   │   │   ├── login.ejs          # Login page
│   │   │   │   └── signup.ejs         # Signup page
│   │   │   ├── partials/
│   │   │   │   ├── head.ejs           # HTML head
│   │   │   │   ├── nav.ejs            # Navigation bar
│   │   │   │   ├── favourite.ejs      # Favorite button
│   │   │   │   └── errors.ejs         # Error messages
│   │   │   └── 404.ejs                # 404 page
│   │   ├── public/
│   │   │   ├── output.css             # Compiled Tailwind CSS
│   │   │   └── images/                # Uploaded property photos
│   │   ├── input.css                  # Tailwind input
│   │   ├── tailwind.config.js         # Tailwind config
│   │   ├── postcss.config.js          # PostCSS config
│   │   └── package.json               # Frontend dependencies
│   └── README.md                      # Project documentation
└── .gitignore                         # Git ignore rules
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd AirBnb_clone/AirBnb_clone/AirBnb
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

### Step 3: Frontend Setup
```bash
cd ../frontend
npm install
```

### Step 4: Configure Environment Variables
Create a `.env` file in the `backend` folder (see Environment Variables section)

## ⚙️ Environment Variables

Create a `.env` file in the `backend` directory with these variables:

```env
# MongoDB Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=airbnb-cluster

# Session Configuration
SESSION_SECRET=your_secret_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/png,image/jpg,image/jpeg

# Session Configuration
SESSION_MAX_AGE=86400000
SESSION_COLLECTION=sessions
```

### Getting MongoDB Connection String
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create an account and cluster
3. Click "Connect" and select "Drivers"
4. Copy the connection string
5. Replace `<password>` and `<username>` with your credentials

## ▶️ Running the Application

### Backend Server
```bash
cd backend
npm start
# or for development with auto-reload
npx nodemon app.js
```

The backend will run on `http://localhost:3000`

### Frontend
The frontend is served by the Express server (no separate server needed)

### Access the Application
- Open browser and go to `http://localhost:3000`

## 🛣️ API Routes

### Authentication Routes (`/auth`)
- `GET /auth/signup` - Signup page
- `POST /auth/signup` - Register new user
- `GET /auth/login` - Login page
- `POST /auth/login` - Authenticate user
- `GET /auth/logout` - Logout user

### Store Routes (Guest) (`/`)
- `GET /` - Homepage with all homes
- `GET /homes` - Browse homes
- `GET /homes/:homeId` - Home details
- `GET /book/:homeId` - Booking form
- `POST /book` - Create booking
- `GET /bookings` - My bookings
- `POST /bookings/:bookingId/cancel` - Cancel booking
- `GET /favourites` - My favorites
- `POST /favourites` - Add to favorites
- `POST /favourites/delete/:homeId` - Remove from favorites

### Host Routes (`/host`)
- `GET /host/homes` - My listings
- `GET /host/add-home` - Add home form
- `POST /host/add-home` - Create new home
- `GET /host/edit-home/:homeId` - Edit form
- `POST /host/edit-home/:homeId` - Update home
- `POST /host/delete-home/:homeId` - Delete home

## 💾 Database Schema

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  userType: String (guest/host),
  favourites: [ObjectId] (references to Home)
}
```

### Home Model
```javascript
{
  houseName: String,
  location: String,
  rating: Number,
  price: Number (per night),
  photo: String (URL),
  description: String,
  hostId: ObjectId (reference to User)
}
```

### Booking Model
```javascript
{
  userId: ObjectId (reference to User),
  homeId: ObjectId (reference to Home),
  checkInDate: Date,
  checkOutDate: Date,
  numberOfGuests: Number,
  totalPrice: Number,
  bookingDate: Date (default: now),
  status: String (confirmed/cancelled)
}
```

## 📤 File Upload

### Photo Upload
- **Field Name:** `photo`
- **Allowed Types:** PNG, JPG, JPEG
- **Storage Location:** `frontend/public/images/`
- **URL Path:** `/uploads/filename.jpg`
- **Max Size:** 5MB (configurable in .env)

### Upload Process
1. User selects image from form
2. Multer validates file type and saves to disk
3. Filename is stored in database as relative URL
4. Images are served via Express static middleware

## 🎨 Animations & Icons

### SVG Icons
The application includes a collection of SVG icons for better visual representation:
- **📍 Location Icon** - Mark property locations
- **⭐ Star Icon** - Display ratings (1-5 stars)
- **👥 Users Icon** - Show number of guests
- **📅 Calendar Icon** - Date selection and booking dates
- **❤️ Heart Icon** - Favorites button
- **✓ Check Icon** - Confirmation and status indicators
- **🏠 Home Icon** - Property and homepage indicators

### CSS Animations
Smooth animations and transitions enhance user experience:
- **Hover Effects** - Button and card hover animations
- **Fade Transitions** - Smooth page transitions
- **Loading States** - Visual feedback for user actions
- **Icon Animations** - SVG icon animations on interaction
- **Form Transitions** - Smooth form input focus states
- **Button Interactions** - Scale and shadow effects on hover/click

### Tailwind CSS Utilities
- Transition utilities for smooth effects
- Opacity changes for visual hierarchy
- Transform effects for interactive elements
- Shadow effects for depth perception

## 🔐 Authentication

### Password Security
- Passwords hashed with bcryptjs (12 salt rounds)
- Never stored in plain text
- Verified during login

### Session Management
- Session data stored in MongoDB
- Minimal data in session (userId, userEmail, userType)
- Full user object fetched from database on each request
- Cookies are httpOnly for security
- 24-hour session expiration

## 📅 Booking System

### Booking Flow
1. Guest browses homes
2. Clicks "Book" on desired home
3. Fills check-in date, check-out date, number of guests
4. System calculates total price (nights × price/night)
5. Booking is created in database with "confirmed" status
6. User can view booking in "My Bookings"
7. User can cancel booking (status changes to "cancelled")

### Validation
- Check-out date must be after check-in date
- At least 1 guest required
- Total price calculated automatically

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB Atlas cluster is running
- Check connection string in `.env`
- Ensure IP whitelist includes your IP address

### File Upload Errors
- Check if `frontend/public/images/` directory exists
- Verify image file type is PNG, JPG, or JPEG
- Check file size is under 5MB

### Session Not Persisting
- Ensure MongoDB session store is connected
- Check browser cookies are enabled
- Verify `.env` variables are correct

### Port Already in Use
```bash
# Change PORT in .env file
PORT=3001
```

## 📧 Contact & Support

For issues or questions, please open an issue in the repository.

---

**Happy Coding! 🎉**
