const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const router = express.Router();

router.post('/register', [
    check('name', 'Name is required').not().isEmpty(),
    check('phone', 'Phone is required and should be a number').isNumeric(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('type', 'Type is required and should be either Client or Partner').isIn(['Client', 'Partner']),
    check('admin', 'Admin should be a boolean').isBoolean()
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5 days' }, async (err, token) => {
            if (err) throw err;
            
            // Save token to user
            user.tokens = user.tokens.concat({ token });
            await user.save();
    
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/login',[
    check('phone', 'Phone is required and should be a number').isNumeric(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    try {
        const { phone, password } = req.body;

        let user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5 days' }, async (err, token) => {
            if (err) throw err;
            
            // Save token to user
            user.tokens = user.tokens.concat({ token });
            await user.save();
    
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
