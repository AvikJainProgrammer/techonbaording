const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    type: { type: String, enum: ['Client', 'Partner'], required: true },
    admin: { type: Boolean, default: false }
});

// Hash password before saving the user
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
