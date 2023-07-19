const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

// Create a booking
router.post('/', [
    auth,
    check('status', 'Status is required').not().isEmpty(),
    check('client', 'Client is required').not().isEmpty(),
    check('startTime', 'Start Time is required').not().isEmpty(),
    check('fromHub', 'From Hub is required').not().isEmpty(),
    check('toHub', 'To Hub is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { status, client, createdBy, startTime, fromHub, toHub } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (user.type === 'Partner') {
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

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: 'Invalid booking ID' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (user.type !== 'Partner') {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        if (booking.status !== 'created') {
            return res.status(400).json({ msg: 'Booking is not in a state that allows applying' });
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: 'Invalid booking ID' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (user.type !== 'Partner') {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        if (booking.status !== 'assigned') {
            return res.status(400).json({ msg: 'Booking is not in a state that allows starting' });
        }

        const now = Date.now();
        if (now < booking.startTime) {
            return res.status(400).json({ msg: 'Booking cannot be started before the scheduled start time' });
        }

        booking.status = 'in_progress';
        booking.actualStartTime = now;
        await booking.save();

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// End Trip
router.put('/end/:id', auth, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: 'Invalid booking ID' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (user.type !== 'Partner') {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        if (booking.status !== 'in_progress') {
            return res.status(400).json({ msg: 'Booking is not in a state that allows ending' });
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
