// routes/hubRoutes.js
const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const hubService = require('../services/hubService');

const router = express.Router();

router.post('/', [
    auth,
    check('name', 'Name is required').not().isEmpty(),
    check('location.coordinates', 'Coordinates are required and should be an array of two numbers')
        .isArray({ min: 2, max: 2 })
        .custom((val) => {
            return val.every(Number.isFinite);
        }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, location } = req.body;
        const hub = await hubService.createHub(name, location, req.user.id);
        res.json(hub);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/:id', [
    auth,
    check('name', 'Name is required').not().isEmpty(),
    check('location.coordinates', 'Coordinates are required and should be an array of two numbers')
        .isArray({ min: 2, max: 2 })
        .custom((val) => {
            return val.every(Number.isFinite);
        }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, location } = req.body;
        const hub = await hubService.updateHub(req.params.id, name, location, req.user.id);
        res.json(hub);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await hubService.deleteHub(req.params.id, req.user.id);
        res.json({ msg: 'Hub removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/', async (req, res) => {
    try {
        const hubs = await hubService.listHubs();
        res.json(hubs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
