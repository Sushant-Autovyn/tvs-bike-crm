const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true
    },
    modelName: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    color: {
      type: String
    },
    stock: {
      type: Number,
      default: 0
    },
    description: {
      type: String
    },
    minimumStock: {
  type: Number,
  default: 5
}
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Bike', bikeSchema);