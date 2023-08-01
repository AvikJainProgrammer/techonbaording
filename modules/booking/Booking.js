const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['created', 'assigned', 'cancelled', 'in_progress', 'completed', 'expired'],
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    startTime: {
        type: Date,
        required: true
    },
    actualStartTime: {
        type: Date,
    },
    fromHub: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hub',
        required: true
    },
    toHub: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hub',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Booking', BookingSchema);
