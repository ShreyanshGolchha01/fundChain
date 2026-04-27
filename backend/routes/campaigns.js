const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');

// GET /api/campaigns - all campaigns (public)
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: 'i' };

    const campaigns = await Campaign.find(query).populate('creator', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: campaigns });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/campaigns/my/campaigns - creator's own campaigns
router.get('/my/campaigns', [auth, roleCheck(['creator'])], async (req, res) => {
  try {
    const campaigns = await Campaign.find({ creator: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: campaigns });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/campaigns/:id - single campaign with donors list
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('creator', 'name email');
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    const donations = await Donation.find({ campaign: req.params.id })
      .populate('donor', 'name email')
      .sort({ timestamp: -1 });

    res.json({ success: true, data: { campaign, donations } });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/campaigns - create campaign (creator only)
router.post(
  '/',
  [
    auth,
    roleCheck(['creator']),
    [
      body('title', 'Title is required').not().isEmpty(),
      body('description', 'Description is required').not().isEmpty(),
      body('goalAmount', 'Goal amount must be a number greater than 0').isNumeric().custom((value) => value > 0),
      body('deadline', 'Deadline is required and must be a valid date').isISO8601(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, goalAmount, deadline } = req.body;

    try {
      const newCampaign = new Campaign({
        title,
        description,
        goalAmount,
        deadline,
        creator: req.user.id,
      });

      const campaign = await newCampaign.save();
      res.json({ success: true, data: campaign });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

module.exports = router;
