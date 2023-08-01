const mongoose = require('mongoose');

const HubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

HubSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Hub', HubSchema);
