const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Account = require('../models/Account');
const Category = require('../models/Categories');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'uts_secret_key_2026';

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: email.toLowerCase() === 'admin@test.com' ? 'admin' : 'user'
    });

    await user.save();

    const defaultAccount = new Account({
      name: 'Personal Account',
      budget: 2000,
      userId: user._id
    });

    await defaultAccount.save();

    const defaultCategories = [
      { name: 'Salary', icon: 'DollarSign', color: '#E6642A', userId: user._id },
      { name: 'Rent', icon: 'Home', color: '#409BD8', userId: user._id },
      { name: 'Food', icon: 'Utensils', color: '#8BC3E5', userId: user._id },
      { name: 'Transport', icon: 'Car', color: '#0201D2', userId: user._id },
      { name: 'Shopping', icon: 'ShoppingBag', color: '#F6F1E4', userId: user._id },
      { name: 'Entertainment', icon: 'Tv', color: '#E6642A', userId: user._id },
      { name: 'Gift', icon: 'Gift', color: '#409BD8', userId: user._id },
      { name: 'Health', icon: 'Heart', color: '#8BC3E5', userId: user._id },
      { name: 'Communication', icon: 'Phone', color: '#0201D2', userId: user._id },
      { name: 'Travel', icon: 'Compass', color: '#F6F1E4', userId: user._id },
      { name: 'Other', icon: 'HelpCircle', color: '#2C3E50', userId: user._id }
    ];

    await Category.insertMany(defaultCategories);

    return res.status(201).json({
      success: true,
      message: 'User created with default account and categories'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;