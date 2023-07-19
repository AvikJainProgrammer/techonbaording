// controllers/hubController.js
const { validationResult } = require('express-validator');
const hubService = require('../services/hubService');

async function create(req, res) {
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
}

async function update(req, res) {
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
}

async function remove(req, res) {
    try {
        await hubService.deleteHub(req.params.id, req.user.id);
        res.json({ msg: 'Hub removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

async function list(req, res) {
    try {
        const hubs = await hubService.listHubs();
        res.json(hubs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

module.exports = { create, update, remove, list };
