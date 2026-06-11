const Booking = require('../models/booking');
const Home = require('../models/home');
const User = require('../models/user');

exports.getBookPage = async (req, res, next) => {
    const homeId = req.params.homeId;
    try {
        const home = await Home.findById(homeId);
        if (!home) {
            return res.status(404).send('Home not found');
        }
        res.render('store/reserve', {
            home: home,
            pageTitle: 'Book Home',
            currentPage: 'booking',
            isLoggedIn: req.isLoggedIn,
            user: req.user,
            userType: res.locals.userType,
            errors: [],
        });
    } catch (err) {
        console.error('Error fetching home for booking:', err);
        res.status(500).send('Error loading booking page');
    }
};

exports.postBook = async (req, res, next) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }

    const { homeId, checkInDate, checkOutDate, numberOfGuests } = req.body;
    const errors = [];

    try {
        // Validation
        if (!homeId || !checkInDate || !checkOutDate || !numberOfGuests) {
            errors.push('All fields are required');
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        
        if (checkIn >= checkOut) {
            errors.push('Check-out date must be after check-in date');
        }

        if (numberOfGuests < 1) {
            errors.push('Number of guests must be at least 1');
        }

        if (errors.length > 0) {
            const home = await Home.findById(homeId);
            return res.status(422).render('store/reserve', {
                home: home,
                pageTitle: 'Book Home',
                currentPage: 'booking',
                isLoggedIn: req.isLoggedIn,
                user: req.user,
                userType: res.locals.userType,
                errors: errors,
            });
        }
        const home = await Home.findById(homeId);
        if (!home) {
            return res.status(404).send('Home not found');
        }

        const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const totalPrice = home.price * days;

        // Create booking
        const booking = new Booking({
            userId: req.user._id,
            homeId: homeId,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            numberOfGuests: numberOfGuests,
            totalPrice: totalPrice,
            status: 'confirmed'
        });

        await booking.save();
        console.log('Booking created successfully:', booking._id);

        res.redirect('/bookings');
    } catch (err) {
        console.error('Error creating booking:', err);
        res.status(500).send('Error creating booking');
    }
};

exports.getMyBookings = async (req, res, next) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }

    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('homeId')
            .sort({ bookingDate: -1 });

        res.render('store/bookings', {
            bookings: bookings,
            pageTitle: 'My Bookings',
            currentPage: 'bookings',
            isLoggedIn: req.isLoggedIn,
            user: req.user,
            userType: res.locals.userType,
        });
    } catch (err) {
        console.error('Error fetching bookings:', err);
        res.status(500).send('Error loading bookings');
    }
};

exports.cancelBooking = async (req, res, next) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }

    const { bookingId } = req.params;

    try {
        const booking = await Booking.findById(bookingId);
        
        if (!booking) {
            return res.status(404).send('Booking not found');
        }

        // Check if user owns this booking
        if (booking.userId.toString() !== req.user._id.toString()) {
            return res.status(403).send('Unauthorized');
        }

        booking.status = 'cancelled';
        await booking.save();
        console.log('Booking cancelled:', bookingId);

        res.redirect('/bookings');
    } catch (err) {
        console.error('Error cancelling booking:', err);
        res.status(500).send('Error cancelling booking');
    }
};
