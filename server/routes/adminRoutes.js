const express = require('express');

const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const ActivityLog = require('../models/ActivityLogs');

const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all transactions across all users
router.get('/all-transactions', authenticateToken, isAdmin, async (req, res) => {
  try {
    const globalTransactions = await Transaction.find({}).sort({ date: -1 });
    return res.json(globalTransactions);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get all users
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get one user's transactions
router.get('/users/:userId/activities', authenticateToken, isAdmin, async (req, res) => {
  try {
    const activities = await Transaction.find({
      userId: req.params.userId
    }).sort({ date: -1 });

    return res.json(activities);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get one user's audit logs
router.get('/users/:userId/audit-logs', authenticateToken, isAdmin, async (req, res) => {
  try {
    const logs = await ActivityLog.find({
      userId: req.params.userId
    }).sort({ createdAt: -1 });

    return res.json(logs);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Delete user and related data
router.delete('/users/:userId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const targetUserId = req.params.userId;

    if (String(req.user.id) === String(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account.'
      });
    }

    const deletedUser = await User.findByIdAndDelete(targetUserId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    await Transaction.deleteMany({ userId: targetUserId });
    await Account.deleteMany({ userId: targetUserId });
    await ActivityLog.deleteMany({ userId: targetUserId });

    return res.json({
      success: true,
      message: `User ${deletedUser.name} and all related data deleted.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;