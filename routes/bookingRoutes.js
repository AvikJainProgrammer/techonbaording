const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create a booking
router.post('/', auth, async (req, res) => {
    const { status, client, createdBy, startTime, fromHub, toHub } = req.body;
    try {
        const admin = await User.findById(req.user.id);
        if (!admin || !admin.admin) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        const booking = new Booking({
            status,
            client,
            createdBy: req.user.id,
            startTime,
            fromHub,
            toHub
        });

        const newBooking = await booking.save();

        res.json(newBooking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// List most recent bookings (with pagination). Add a filter to fetch bookings for a hub and client.
router.get('/', async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;
        const keyword = req.query.keyword
            ? { name: { $regex: req.query.keyword, $options: 'i' } }
            : {};

        const count = await Booking.countDocuments({ ...keyword });
        const bookings = await Booking.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ bookings, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Apply on a booking
router.put('/apply/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.type !== 'Partner') {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        if (booking.partner) {
            return res.status(400).json({ msg: 'Booking already assigned' });
        }

        booking.partner = req.user.id;
        booking.status = 'assigned';
        await booking.save();

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Start trip
router.put('/start/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.type !== 'Partner') {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        if (!booking.partner || booking.partner.toString() !== req.user.id.toString()) {
            return res.status(400).json({ msg: 'Booking not assigned to you' });
        }

        booking.status = 'in_progress';
        booking.actualStartTime = Date.now();
        await booking.save();

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// End Trip
router.put('/end/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.type !== 'Partner') {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        if (!booking.partner || booking.partner.toString() !== req.user.id.toString()) {
            return res.status(400).json({ msg: 'Booking not assigned to you' });
        }

        booking.status = 'completed';
        await booking.save();

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
