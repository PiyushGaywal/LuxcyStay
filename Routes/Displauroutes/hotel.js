const express = require('express');
const router = express.Router();
const Info = require('../../models/info');
const Hotel = require('../../models/Hotel');


router.get('/submit-booking', async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.render('Display/hii', { hotels }); 
    } catch (err) {
        console.error(err);
        res.send('Error fetching hotels');
    }
});


router.post('/submit-booking', (req, res) => {
    req.session.bookingData = {
        roomType: req.body.roomType,
        acType: req.body.acType,
        checkIn: req.body.checkIn,
        checkOut: req.body.checkOut,
        guests: req.body.guests,
        name: req.body.name,
        email: req.body.email,
        payment: req.body.payment
    };
    res.redirect('/select-hotel');
});


router.get('/select-hotel', async (req, res) => {
    if (!req.session.bookingData) return res.redirect('/submit-booking');

    try {
        const hotels = await Hotel.find();
        res.render('Display/hi', { hotels }); 
    } catch (err) {
        console.error(err);
        res.send('Error fetching hotels');
    }
});


router.post('/select-hotel', async (req, res) => {
    if (!req.session.bookingData) return res.redirect('/submit-booking');

    const bookingData = req.session.bookingData;
    bookingData.hotelName = req.body.hotelName;

    try {
        const newBooking = new Info(bookingData);
        await newBooking.save();
        req.session.bookingData = null;
        res.redirect('/end');
    } catch (err) {
        console.error(err);
        res.send('Error saving booking');
    }
});

module.exports = router;
