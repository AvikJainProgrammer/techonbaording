// userRoutes.js

const express = require('express');
const auth = require('../../middleware/auth'); 
const userService = require('./userService'); 
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
        const token = await userService.registerUser(name, phone, password, type, admin);
        res.json({ token });
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
        const token = await userService.loginUser(phone, password);
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const user = await userService.getUserById(req.user.id);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
