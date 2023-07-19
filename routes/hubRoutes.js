// routes/hub.js
const express = require('express');
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const hubController = require('../controllers/hubController');

const router = express.Router();

router.post('/', [
    auth,
    check('name', 'Name is required').not().isEmpty(),
    check('location.coordinates', 'Coordinates are required and should be an array of two numbers')
        .isArray({ min: 2, max: 2 })
        .custom((val) => {
            return val.every(Number.isFinite);
        }),
], hubController.create);

router.put('/:id', [
    auth,
    check('name', 'Name is required').not().isEmpty(),
    check('location.coordinates', 'Coordinates are required and should be an array of two numbers')
        .isArray({ min: 2, max: 2 })
        .custom((val) => {
            return val.every(Number.isFinite);
        }),
], hubController.update);

router.delete('/:id', auth, hubController.remove);

router.get('/', hubController.list);

module.exports = router;
