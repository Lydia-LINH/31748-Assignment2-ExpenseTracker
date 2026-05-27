const mongoose = require('mongoose');

// the schema for user-defined categories, which are linked to users and can be customized with icons and colors
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'DollarSign'
  },
  color: {
    type: String,
    default: '#111827' // default to a dark gray, but users can customize this for better visual organization
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // bind user ID, strictly align with the isolation logic in your index.js
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);