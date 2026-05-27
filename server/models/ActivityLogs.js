const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // operating user
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // if it's an admin checking someone else's records, this records who is being operated on
  action: { type: String, required: true }, // e.g., 'CREATE_TRANSACTION', 'EDIT_TRANSACTION', 'DELETE_USER'
  details: { type: Object, required: true }, // record the values before and after the modification, or the operation description
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);