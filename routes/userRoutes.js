// routes/user.js
const express = require('express');
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', [
    check('name', 'Name is required').not().isEmpty(),
    check('phone', 'Phone is required and should be a number').isNumeric(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('type', 'Type is required and should be either Client or Partner').isIn(['Client', 'Partner']),
    check('admin', 'Admin should be a boolean').isBoolean()
], userController.register);

router.post('/login',[
    check('phone', 'Phone is required and should be a number').isNumeric(),
    check('password', 'Password is required').exists()
], userController.login);

router.get('/me', auth, userController.getMe);

module.exports = router;
