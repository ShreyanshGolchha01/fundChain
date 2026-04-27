require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const Block = require('../models/Block');
const { createGenesisBlockIfNotExist } = require('../utils/blockchainSim');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-crowdfunding';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected for Seeding');

    // Clear existing data
    await User.deleteMany();
    await Campaign.deleteMany();
    await Donation.deleteMany();
    await Block.deleteMany();
    console.log('Cleared existing data');

    // Create Genesis Block
    await createGenesisBlockIfNotExist();

    // Create Users
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const creator = new User({
      name: 'Alice Creator',
      email: 'alice@example.com',
      password: passwordHash,
      role: 'creator',
    });

    const donor = new User({
      name: 'Bob Donor',
      email: 'bob@example.com',
      password: passwordHash,
      role: 'donor',
    });

    await creator.save();
    await donor.save();
    console.log('Created test users');

    // Create Campaigns
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const campaigns = [
      {
        title: 'Save the Ocean',
        description: 'A campaign to clean up plastic from the ocean.',
        goalAmount: 10000,
        deadline: nextWeek,
        creator: creator._id,
      },
      {
        title: 'Tech for Kids',
        description: 'Providing laptops to underprivileged children.',
        goalAmount: 5000,
        deadline: nextWeek,
        creator: creator._id,
      },
      {
        title: 'Expired Project',
        description: 'This project has already passed its deadline.',
        goalAmount: 20000,
        deadline: lastWeek,
        creator: creator._id,
      }
    ];

    await Campaign.insertMany(campaigns);
    console.log('Created sample campaigns');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
