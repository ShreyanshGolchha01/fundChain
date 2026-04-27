require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const { createGenesisBlockIfNotExist, checkAllExpiredCampaigns } = require('./utils/blockchainSim');

// Route imports
const authRoutes = require('./routes/auth');
const campaignRoutes = require('./routes/campaigns');
const donationRoutes = require('./routes/donations');
const blockchainRoutes = require('./routes/blockchain');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-crowdfunding';

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await createGenesisBlockIfNotExist();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/blockchain', blockchainRoutes);

// Smart Contract Scheduled Job: Check for expired campaigns every 60 seconds
setInterval(() => {
  checkAllExpiredCampaigns();
}, 60000);

app.get('/', (req, res) => {
  res.json({ message: 'Smart Crowdfunding System API' });
});

module.exports = app;
