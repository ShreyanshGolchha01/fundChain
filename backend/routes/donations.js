const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const { addTransaction, checkAndSettleCampaign } = require('../utils/blockchainSim');

// POST /api/donations/donate/:campaignId - donate (donor only)
router.post(
  '/donate/:campaignId',
  [
    auth,
    roleCheck(['donor']),
    body('amount', 'Amount must be a number greater than 0').isNumeric().custom((value) => value > 0)
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const campaign = await Campaign.findById(req.params.campaignId);
      if (!campaign) {
        return res.status(404).json({ success: false, message: 'Campaign not found' });
      }

      if (campaign.status !== 'active') {
        return res.status(400).json({ success: false, message: 'Campaign is not active' });
      }

      // Check if creator is trying to donate to own campaign (though middleware restricts to 'donor' role anyway)
      if (campaign.creator.toString() === req.user.id) {
        return res.status(403).json({ success: false, message: 'You cannot donate to your own campaign' });
      }

      const { amount } = req.body;
      
      // Blockchain logic
      const donationData = {
        campaign: campaign._id,
        donor: req.user.id,
        amount: Number(amount)
      };

      const { newBlock, transactionId, blockHash, blockNumber, timestamp } = await addTransaction(donationData);

      // Create Donation
      const newDonation = new Donation({
        campaign: campaign._id,
        donor: req.user.id,
        amount: Number(amount),
        transactionId,
        blockHash,
        blockNumber,
        timestamp,
      });

      const donation = await newDonation.save();

      // Complete the block
      newBlock.transactions.push(donation._id);
      await newBlock.save();

      // Update Campaign raisedAmount
      campaign.raisedAmount += Number(amount);
      await campaign.save();

      // Check Smart Contract Conditions
      await checkAndSettleCampaign(campaign._id);

      res.json({ success: true, data: donation, message: 'Donation successful' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

module.exports = router;
