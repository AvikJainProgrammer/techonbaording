// services/userService.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function registerUser(name, phone, password, type, admin) {
    // Check if user already exists
    let user = await User.findOne({ phone });
    if (user) {
        throw new Error('User already exists');
    }

    user = new User({
        name,
        phone,
        password,
        type,
        admin
    });

    await user.save();

    // Create token
    const payload = {
        user: {
            id: user.id
        }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5 days' });

    // Save token to user
    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

async function loginUser(phone, password) {
    let user = await User.findOne({ phone });
    if (!user) {
        throw new Error('Invalid Credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid Credentials');
    }

    const payload = {
        user: {
            id: user.id
        }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5 days' });

    // Save token to user
    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

async function getUserById(id) {
    const user = await User.findById(id).select('-password');
    return user;
}

module.exports = { registerUser, loginUser, getUserById };
