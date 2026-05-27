const express = require('express');

const Transaction = require('../models/Transaction');
const ActivityLog = require('../models/ActivityLogs');

const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all transactions for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const txs = await Transaction.find({
      userId: req.user.id
    }).sort({ date: -1 });

    return res.json(txs);
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
});

// Create transaction
router.post('/', authenticateToken, async (req, res) => {
  try {
    const transactionData = {
      ...req.body,
      userId: req.user.id
    };

    const newTx = new Transaction(transactionData);

    await newTx.save();

    return res.status(201).json(newTx);
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
});

// Update transaction
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const oldTransaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!oldTransaction) {
      return res.status(404).json({
        message: 'Not found or unauthorized'
      });
    }

    const updatedTx = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id
      },
      req.body,
      {
        returnDocument: 'after'
      }
    );

    await ActivityLog.create({
      userId: req.user.id,
      targetUserId: req.user.id,
      action: 'EDIT_TRANSACTION',
      details: {
        transactionId: req.params.id,
        before: oldTransaction,
        after: updatedTx
      }
    });

    return res.json(updatedTx);
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
});

// Delete transaction
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!result) {
      return res.status(404).json({
        message: 'Not found or unauthorized'
      });
    }

    return res.json({
      message: 'Deleted'
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;