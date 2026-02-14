const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Info = require('../models/info');
const Hotel = require('../models/Hotel');
const multer = require('multer');
const path = require('path');

function isAdmin(req, res, next) {
    if (req.session && req.session.admin) {
        return next();
    }
    res.redirect('/admin/login');
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.redirect('/admin/login');
});

router.get('/login', (req, res) => {
    res.render('admin/login');
});

router.post('/login', async (req, res) => {
    const { Username, Password } = req.body;
    try {
        const admin = await Admin.findOne({ Username, Password });
        if (!admin) {
            return res.send('Invalid Credentials');
        }
        req.session.admin = admin;
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.log(err);
        res.send('Error logging in');
    }
});

router.get('/dashboard', isAdmin, async (req, res) => {
    try {
        const totalBookings = await Info.countDocuments();
        const recentBookings = await Info.find().sort({ _id: -1 }).limit(5);
        res.render('admin/dashboard', { totalBookings, recentBookings });
    } catch (err) {
        console.log(err);
        res.send('Error loading dashboard');
    }
});

router.get('/bookings', isAdmin, async (req, res) => {
    try {
        const bookings = await Info.find();
        res.render('admin/bookings', { bookings });
    } catch (err) {
        console.log(err);
        res.send('Error fetching bookings');
    }
});

router.get('/hotels', isAdmin, async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.render('admin/hotels', { hotels });
    } catch (err) {
        console.log(err);
        res.send('Error fetching hotels');
    }
});

router.post('/add-hotel', isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, price } = req.body;
        const image = req.file.filename;
        const newHotel = new Hotel({ name, price, image });
        await newHotel.save();
        res.redirect('/admin/hotels');
    } catch (err) {
        console.log(err);
        res.send('Error adding hotel');
    }
});

router.post('/delete-hotel/:id', isAdmin, async (req, res) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        res.redirect('/admin/hotels');
    } catch (err) {
        console.log(err);
        res.send('Error deleting hotel');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

module.exports = router;
