const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // connect to the user who owns this transaction, ensuring data isolation and multi-user support
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // basic transaction information
  type: { 
    type: String, 
    enum: ['income', 'expense'], 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  // category and account
  category: { 
    type: String, 
    required: true 
  },
  account: { 
    type: String, 
    required: true 
  },
  // optional additional information
  date: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  tag: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// export the model
module.exports = mongoose.model('Transaction', transactionSchema);