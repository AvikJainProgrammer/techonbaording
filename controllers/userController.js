// controllers/userController.js
const { validationResult } = require('express-validator');
const userService = require('../services/userService');

async function register(req, res) {
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
}

async function login(req, res) {
    try {
        const { phone, password } = req.body;
        const token = await userService.loginUser(phone, password);
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

async function getMe(req, res) {
    try {
        const user = await userService.getUserById(req.user.id);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

module.exports = { register, login, getMe };
