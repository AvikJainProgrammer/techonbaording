const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const hubRoutes = require('./routes/hubRoutes');  
const expireJobs = require('./jobs/expireJobs');  // Add this line

const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://admin:password@mongodb:27017/?authMechanism=DEFAULT&authSource=admin', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.log(err));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/hubs', hubRoutes);  // New line: Use hub routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    expireJobs;
});
