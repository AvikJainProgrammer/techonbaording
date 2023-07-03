const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, phone, password, type, admin } = req.body;

        // Check if user already exists
        let user = await User.findOne({ phone });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
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

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5 days' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
