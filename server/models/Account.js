// server/models/Account.js
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  budget: { type: Number, default: 0 },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true // ensure every account is linked to a user
  }
});

// Create a compound index (optional but recommended) to ensure account names are unique per user
accountSchema.index({ name: 1, userId: 1 }, { unique: true });
module.exports = mongoose.model('Account', accountSchema);