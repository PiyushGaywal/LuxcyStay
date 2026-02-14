const mongoose = require('mongoose');

const info = new mongoose.Schema({
    hotelName: { type: String, required: true },
    roomType: { type: String, required: true },
    acType: { type: String, required: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    guests: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    payment: { type: String, required: true }
});

module.exports = mongoose.model('Info', info);
