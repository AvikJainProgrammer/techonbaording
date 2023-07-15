// // jobs/expireJobs.js

// const Bull = require('bull');
// const Booking = require('../models/Booking');

// // Initialize a new Bull queue
// const expireQueue = new Bull('bookings', {
//   redis: {
//     host: '127.0.0.1',
//     port: 6379
//   }
// });

// // Process jobs in the queue
// expireQueue.process(async (job, done) => {
//   console.log('Processing expiry job...');

//   const now = Date.now();

//   // Get all bookings that are 15 minutes old and are not assigned to a partner
//   const bookings = await Booking.find({
//     status: 'created',
//     createdAt: { $lte: new Date(now - 15 * 60 * 1000) }
//   });

//   // Update the status of these bookings to 'expired'
//   bookings.forEach(async (booking) => {
//     booking.status = 'expired';
//     await booking.save();
//   });

//   done();
// });

// // Schedule a job to run every 15 minutes
// expireQueue.add({}, { repeat: { cron: '*/15 * * * *' } });

// module.exports = expireQueue;
