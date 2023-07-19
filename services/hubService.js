// services/hubService.js
const Hub = require('../models/Hub');
const User = require('../models/User');

async function createHub(name, location, userId) {
    const user = await User.findById(userId);
    if (!user.admin) {
        throw new Error('Unauthorized');
    }

    const newHub = new Hub({
        name,
        location,
        owner: userId,
    });

    const hub = await newHub.save();
    return hub;
}

async function updateHub(id, name, location, userId) {
    const user = await User.findById(userId);
    if (!user.admin) {
        throw new Error('Unauthorized');
    }

    let hub = await Hub.findById(id);
    if (!hub) throw new Error('Hub not found');

    hub = await Hub.findByIdAndUpdate(
        id,
        { $set: { name, location } },
        { new: true }
    );

    return hub;
}

async function deleteHub(id, userId) {
    const user = await User.findById(userId);
    if (!user.admin) {
        throw new Error('Unauthorized');
    }

    let hub = await Hub.findById(id);
    if (!hub) throw new Error('Hub not found');

    await Hub.findByIdAndRemove(id);
}

async function listHubs() {
    const hubs = await Hub.find().populate('owner', ['name']);
    return hubs;
}

module.exports = { createHub, updateHub, deleteHub, listHubs };
