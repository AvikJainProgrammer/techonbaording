// bookingController.js

const bookingService = require('../services/bookingService');
const { validationResult } = require('express-validator');

const createBooking = async (req, res) => {
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
};

const getRecentBookings = async (req, res) => {
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
};

const applyBooking = async (req, res) => {
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
};

const startBooking = async (req, res) => {
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
};

const endBooking = async (req, res) => {
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
};

module.exports = {
    createBooking,
    getRecentBookings,
    applyBooking,
    startBooking,
    endBooking,
};
