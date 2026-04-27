const express = require('express');
const router = express.Router();
const Block = require('../models/Block');
const Donation = require('../models/Donation');

// GET /api/blockchain/blocks - all blocks
router.get('/blocks', async (req, res) => {
  try {
    const blocks = await Block.find().sort({ blockNumber: -1 }).populate('transactions');
    res.json({ success: true, data: blocks });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/blockchain/blocks/:id - single block detail
router.get('/blocks/:id', async (req, res) => {
  try {
    const block = await Block.findById(req.params.id).populate({
      path: 'transactions',
      populate: [
        { path: 'donor', select: 'name email' },
        { path: 'campaign', select: 'title' }
      ]
    });
    if (!block) {
      return res.status(404).json({ success: false, message: 'Block not found' });
    }
    res.json({ success: true, data: block });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Block not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/blockchain/transactions - all transactions
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Donation.find()
      .populate('donor', 'name email')
      .populate('campaign', 'title')
      .sort({ timestamp: -1 });
    res.json({ success: true, data: transactions });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
