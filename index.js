const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();
app.use(express.json());

// Connect to database
connectDB();

// Import schemas
const User = require('./models/User');
const JobPost = require('./models/JobPost');
const Application = require('./models/Application');

// Basic test route
app.get('/', (req, res) => {
  res.send('GIU Nexus server is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});