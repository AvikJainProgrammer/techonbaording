const express = require('express');
const mongoose = require('mongoose');
const expireJobs = require('./jobs/expireJobs');
const userRoutes = require('./routes/userRoutes');

// require('dotenv').config();

const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://admin:password@mongodb:27017/?authMechanism=DEFAULT&authSource=admin', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.log(err));


// Use routes
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
