const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      default: ''
    },
    interestedBike: {
      type: String,
      default: ''
    },
    source: {
      type: String,
      enum: ['walk-in', 'call', 'website', 'social-media', 'reference'],
      default: 'walk-in'
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'follow-up', 'converted', 'lost'],
      default: 'new'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Lead', leadSchema);