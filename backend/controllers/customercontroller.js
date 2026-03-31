const Customer = require('../models/customer');

// CREATE
const createCustomer = async (req, res) => {
  try {
    const { name, phone, email, address, city, notes } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        message: 'Name and phone are required'
      });
    }

    const customer = await Customer.create({
      name,
      phone,
      email,
      address,
      city,
      notes
    });

    res.status(201).json({
      message: 'Customer created successfully',
      customer
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Customers fetched successfully',
      customers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({
      message: 'Customer updated successfully',
      customer
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};