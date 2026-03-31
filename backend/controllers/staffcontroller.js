const User = require('../models/user');

// Get all staff
const getStaff = async (req, res) => {
  try {
    const staff = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Staff fetched successfully',
      staff
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Add staff
const createStaff = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: 'Name, email, password and role are required'
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: 'Staff created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Update staff role
const updateStaffRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'Staff not found'
      });
    }

    res.status(200).json({
      message: 'Staff role updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Delete staff
const deleteStaff = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'Staff not found'
      });
    }

    res.status(200).json({
      message: 'Staff deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getStaff,
  createStaff,
  updateStaffRole,
  deleteStaff
};