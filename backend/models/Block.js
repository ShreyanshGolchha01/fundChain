const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  blockNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  hash: {
    type: String,
    required: true,
  },
  previousHash: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
    },
  ],
  nonce: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Block', blockSchema);
