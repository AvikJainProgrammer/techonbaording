// bookingRoutes.js

const express = require('express');
const router = express.Router();
const bookingService = require('./bookingService');  
const auth = require('../../middleware/auth'); 
const { check, validationResult } = require('express-validator');

router.post('/', [
    auth,
    check('status', 'Status is required').not().isEmpty(),
    check('client', 'Client is required').not().isEmpty(),
    check('startTime', 'Start Time is required').not().isEmpty(),
    check('fromHub', 'From Hub is required').not().isEmpty(),
    check('toHub', 'To Hub is required').not().isEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const newBooking = await bookingService.createBooking({
            ...req.body,
            userId: req.user.id
        });

        res.json(newBooking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/', async (req, res) => {
    try {
        const bookings = await bookingService.getRecentBookings({
            pageSize: 10,
            pageNumber: req.query.pageNumber,
            keyword: req.query.keyword
        });

        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/apply/:id', auth, async (req, res) => {
    try {
        const booking = await bookingService.applyBooking({
            userId: req.user.id,
            bookingId: req.params.id,
        });
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/start/:id', auth, async (req, res) => {
    try {
        const booking = await bookingService.startBooking({
            userId: req.user.id,
            bookingId: req.params.id,
        });
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/end/:id', auth, async (req, res) => {
    try {
        const booking = await bookingService.endBooking({
            userId: req.user.id,
            bookingId: req.params.id,
        });
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
