// bookingService.js

const Booking = require('./BookingModel'); 
const User = require('../user/UserModel'); 
const mongoose = require('mongoose');

const createBooking = async ({ status, client, createdBy, startTime, fromHub, toHub, userId }) => {
    const user = await User.findById(userId);

    if (user.type === 'Partner') {
        throw new Error('Unauthorized');
    }

    const booking = new Booking({
        status,
        client,
        createdBy: userId,
        startTime,
        fromHub,
        toHub
    });

    return await booking.save();
};

const getRecentBookings = async ({ pageSize = 10, pageNumber = 1, keyword }) => {
    const page = Number(pageNumber) || 1;
    const query = keyword
        ? { name: { $regex: keyword, $options: 'i' } }
        : {};

    const count = await Booking.countDocuments({ ...query });
    const bookings = await Booking.find({ ...query })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    return { bookings, page, pages: Math.ceil(count / pageSize) };
};

const applyBooking = async ({ userId, bookingId }) => {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new Error('Invalid booking ID');
    }

    const user = await User.findById(userId);
    if (user.type !== 'Partner') {
        throw new Error('Unauthorized');
    }

    let booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new Error('Booking not found');
    }

    if (booking.status !== 'created') {
        throw new Error('Booking is not in a state that allows applying');
    }

    booking.partner = userId;
    booking.status = 'assigned';

    return await booking.save();
};

const startBooking = async ({ userId, bookingId }) => {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new Error('Invalid booking ID');
    }

    const user = await User.findById(userId);
    if (user.type !== 'Partner') {
        throw new Error('Unauthorized');
    }

    let booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new Error('Booking not found');
    }

    if (booking.status !== 'assigned') {
        throw new Error('Booking is not in a state that allows starting');
    }

    const now = Date.now();
    if (now < booking.startTime) {
        throw new Error('Booking cannot be started before the scheduled start time');
    }

    booking.status = 'in_progress';
    booking.actualStartTime = now;

    return await booking.save();
};

const endBooking = async ({ userId, bookingId }) => {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new Error('Invalid booking ID');
    }

    const user = await User.findById(userId);
    if (user.type !== 'Partner') {
        throw new Error('Unauthorized');
    }

    let booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new Error('Booking not found');
    }

    if (booking.status !== 'in_progress') {
        throw new Error('Booking is not in a state that allows ending');
    }

    booking.status = 'completed';

    return await booking.save();
};

module.exports = {
    createBooking,
    getRecentBookings,
    applyBooking,
    startBooking,
    endBooking,
};
