require('dotenv').config(); // ← must be first

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/profile', require('./routes/profileRoutes'));
app.use('/api/v1/jobs', require('./routes/jobRoutes'));
app.use('/api/v1/applications', require('./routes/applicationRoutes'));
// Health check
app.get('/', (req, res) => {
  res.json({ message: 'GIU Nexus API is running' });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});