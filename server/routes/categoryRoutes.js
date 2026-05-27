const express = require('express');

const Category = require('../models/Categories');

const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get categories
router.get('/', authenticateToken, async (req, res) => {
  try {
    const categories = await Category.find({
      userId: req.user.id
    });

    return res.json(categories);
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
});

// Create category
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, icon, color } = req.body;

    const newCategory = new Category({
      name,
      icon: icon || 'DollarSign',
      color: color || '#111827',
      userId: req.user.id
    });

    await newCategory.save();

    return res.status(201).json(newCategory);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Update category
router.put('/:name', authenticateToken, async (req, res) => {
  try {
    const { name, icon, color } = req.body;

    const updatedCategory = await Category.findOneAndUpdate(
      {
        name: req.params.name,
        userId: req.user.id
      },
      {
        $set: {
          name,
          icon,
          color: color || '#111827'
        }
      },
      {
        returnDocument: 'after'
      }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    return res.json(updatedCategory);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Delete category
router.delete('/:name', authenticateToken, async (req, res) => {
  try {
    const result = await Category.findOneAndDelete({
      name: req.params.name,
      userId: req.user.id
    });

    if (!result) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    return res.json({
      message: 'Deleted successfully'
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;