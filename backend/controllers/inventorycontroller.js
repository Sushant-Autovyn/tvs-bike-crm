const Bike = require('../models/bike');

// Get all inventory
const getInventory = async (req, res) => {
  try {
    const bikes = await Bike.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Inventory fetched successfully',
      inventory: bikes
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Update stock
const updateStock = async (req, res) => {
  try {
    const { stock } = req.body;

    const bike = await Bike.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({
        message: 'Bike not found'
      });
    }

    bike.stock = stock;
    await bike.save();

    res.status(200).json({
      message: 'Stock updated successfully',
      bike
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Low stock bikes
const getLowStock = async (req, res) => {
  try {
    const bikes = await Bike.find({
      $expr: { $lte: ['$stock', '$minimumStock'] }
    });

    res.status(200).json({
      message: 'Low stock bikes fetched',
      bikes
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getInventory,
  updateStock,
  getLowStock
};