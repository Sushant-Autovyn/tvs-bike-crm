const Bike = require('../models/bike');

// CREATE
const createBike = async (req, res) => {
  try {
    const { brand, modelName, category, price, color, stock, description } = req.body;

    if (!brand || !modelName || !category || !price) {
      return res.status(400).json({
        message: 'Brand, model name, category and price are required'
      });
    }

    const bike = await Bike.create({
      brand,
      modelName,
      category,
      price,
      color,
      stock,
      description
    });

    res.status(201).json({
      message: 'Bike created successfully',
      bike
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
const getBikes = async (req, res) => {
  try {
    const bikes = await Bike.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Bikes fetched successfully',
      bikes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE
const getBikeById = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({
        message: 'Bike not found'
      });
    }

    res.status(200).json({ bike });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
const updateBike = async (req, res) => {
  try {
    const bike = await Bike.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    if (!bike) {
      return res.status(404).json({
        message: 'Bike not found'
      });
    }

    res.status(200).json({
      message: 'Bike updated successfully',
      bike
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
const deleteBike = async (req, res) => {
  try {
    const bike = await Bike.findByIdAndDelete(req.params.id);

    if (!bike) {
      return res.status(404).json({
        message: 'Bike not found'
      });
    }

    res.status(200).json({
      message: 'Bike deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBike,
  getBikes,
  getBikeById,
  updateBike,
  deleteBike
};