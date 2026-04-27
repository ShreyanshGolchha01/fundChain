const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const Block = require('../models/Block');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');

const generateHash = (blockNumber, previousHash, timestamp, transactions) => {
  const data = JSON.stringify({ blockNumber, previousHash, timestamp, transactions });
  return crypto.createHash('sha256').update(data).digest('hex');
};

const getLatestBlock = async () => {
  return await Block.findOne().sort({ blockNumber: -1 });
};

const createGenesisBlockIfNotExist = async () => {
  const count = await Block.countDocuments();
  if (count === 0) {
    const timestamp = new Date();
    const hash = generateHash(0, '0', timestamp, []);
    const genesisBlock = new Block({
      blockNumber: 0,
      hash,
      previousHash: '0',
      timestamp,
      transactions: [],
      nonce: 0,
    });
    await genesisBlock.save();
    console.log('Genesis block created.');
  }
};

const addTransaction = async (donationData) => {
  const latestBlock = await getLatestBlock();
  const previousHash = latestBlock.hash;
  const blockNumber = latestBlock.blockNumber + 1;
  const timestamp = new Date();
  const nonce = Math.floor(Math.random() * 1000000);
  
  // Create block with pending transaction ID reference.
  // Wait, donationData is an object that needs to be saved as a Donation.
  // Actually, we should create the block hash first, and then save the donation and then the block.
  // Or just save donation first with block info, then save block.

  const hash = generateHash(blockNumber, previousHash, timestamp, [donationData]);
  const transactionId = uuidv4();

  const newBlock = new Block({
    blockNumber,
    hash,
    previousHash,
    timestamp,
    transactions: [], // Will push the donation _id here
    nonce,
  });

  return { newBlock, transactionId, blockHash: hash, blockNumber, timestamp };
};

const checkAndSettleCampaign = async (campaignId) => {
  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return;

    if (campaign.status !== 'active') return;

    if (campaign.raisedAmount >= campaign.goalAmount) {
      campaign.status = 'funded';
      await campaign.save();
      console.log(`Funds released to creator: ${campaign.raisedAmount} for campaign ${campaign._id}`);
      return;
    }

    const now = new Date();
    if (campaign.deadline < now && campaign.raisedAmount < campaign.goalAmount) {
      campaign.status = 'failed';
      await campaign.save();
      console.log(`Refund triggered for donors for campaign ${campaign._id}`);
    }
  } catch (error) {
    console.error('Error in checkAndSettleCampaign:', error);
  }
};

const checkAllExpiredCampaigns = async () => {
  try {
    const now = new Date();
    const expiredCampaigns = await Campaign.find({
      status: 'active',
      deadline: { $lt: now }
    });

    for (let campaign of expiredCampaigns) {
      await checkAndSettleCampaign(campaign._id);
    }
  } catch (error) {
    console.error('Error checking expired campaigns:', error);
  }
};

module.exports = {
  generateHash,
  addTransaction,
  checkAndSettleCampaign,
  checkAllExpiredCampaigns,
  createGenesisBlockIfNotExist,
};
