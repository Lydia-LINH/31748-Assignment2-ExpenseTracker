const express = require('express');

const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get accounts for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.id });
    return res.json(accounts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Create or update account
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, budget } = req.body;

    const account = await Account.findOneAndUpdate(
      { name, userId: req.user.id },
      { name, budget, userId: req.user.id },
      { upsert: true, returnDocument: 'after' }
    );

    return res.json(account);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Rename account and update related transactions
router.put('/rename', authenticateToken, async (req, res) => {
  try {
    const { oldName, newName, budget } = req.body;
    const userId = req.user.id;

    const updatedAccount = await Account.findOneAndUpdate(
      { name: oldName, userId },
      { name: newName, budget },
      { returnDocument: 'after' }
    );

    if (updatedAccount) {
      await Transaction.updateMany(
        { account: oldName, userId },
        { account: newName }
      );
    }

    return res.json(updatedAccount);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Update budget
router.post('/budget', authenticateToken, async (req, res) => {
  try {
    const { account, amount } = req.body;

    const result = await Account.findOneAndUpdate(
      { name: account, userId: req.user.id },
      { budget: amount },
      { upsert: true, returnDocument: 'after' }
    );

    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Delete account and related transactions
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const accountName = req.query.name;
    const userId = req.user.id;

    if (!accountName) {
      return res.status(400).json({ message: 'Account name is required' });
    }

    const deletedAccount = await Account.findOneAndDelete({
      name: accountName,
      userId
    });

    if (!deletedAccount) {
      return res.status(404).json({
        message: 'Account not found or unauthorized'
      });
    }

    await Transaction.deleteMany({
      account: accountName,
      userId
    });

    return res.json({
      message: `Account "${accountName}" and related transactions deleted successfully.`
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;