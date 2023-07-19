// bookingRoutes.js

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

router.post('/', [
    auth,
    check('status', 'Status is required').not().isEmpty(),
    check('client', 'Client is required').not().isEmpty(),
    check('startTime', 'Start Time is required').not().isEmpty(),
    check('fromHub', 'From Hub is required').not().isEmpty(),
    check('toHub', 'To Hub is required').not().isEmpty()
], bookingController.createBooking);

router.get('/', bookingController.getRecentBookings);

router.put('/apply/:id', auth, bookingController.applyBooking);

router.put('/start/:id', auth, bookingController.startBooking);

router.put('/end/:id', auth, bookingController.endBooking);

module.exports = router;
