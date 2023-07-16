const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Hub = require('../models/Hub');
const User = require('../models/User');

// Create a hub
router.post('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.admin) {
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
router.put('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.admin) {
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
        if (!user || !user.admin) {
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
    try {
        const hubs = await Hub.find().populate('owner', ['name']);
        res.json(hubs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
