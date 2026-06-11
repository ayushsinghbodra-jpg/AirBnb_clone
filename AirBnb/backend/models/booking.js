const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    homeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Home',
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    numberOfGuests: {
        type: Number,
        required: true,
        default: 1
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'confirmed'
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
