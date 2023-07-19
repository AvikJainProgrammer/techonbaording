const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Hub = require('../models/Hub');
const User = require('../models/User');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

// Create a hub
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
        const user = await User.findById(req.user.id);
        if (!user.admin) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        const { name, location } = req.body;
        const newHub = new Hub({
            name,
            location,
            owner: req.user.id,
        });

        const hub = await newHub.save();
        res.json(hub);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a hub
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
        const user = await User.findById(req.user.id);
        if (!user.admin) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        let hub = await Hub.findById(req.params.id);
        if (!hub) return res.status(404).json({ msg: 'Hub not found' });

        const { name, location } = req.body;

        hub = await Hub.findByIdAndUpdate(
            req.params.id,
            { $set: { name, location } },
            { new: true }
        );

        res.json(hub);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a hub
router.delete('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.admin) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        let hub = await Hub.findById(req.params.id);
        if (!hub) return res.status(404).json({ msg: 'Hub not found' });

        await Hub.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Hub removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// List all hubs
router.get('/', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: 'Invalid hub ID' });
    }

    try {
        const hubs = await Hub.find().populate('owner', ['name']);
        res.json(hubs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
