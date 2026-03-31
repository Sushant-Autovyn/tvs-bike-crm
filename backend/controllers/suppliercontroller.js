const Supplier = require('../models/supplier');

const createSupplier = async (req, res) => {
  try {
    const { name, companyName, phone, email, address, suppliedBrands } = req.body;

    if (!name || !companyName || !phone) {
      return res.status(400).json({
        message: 'Name, company name and phone are required'
      });
    }

    const supplier = await Supplier.create({
      name,
      companyName,
      phone,
      email,
      address,
      suppliedBrands: suppliedBrands || []
    });

    res.status(201).json({
      message: 'Supplier created successfully',
      supplier
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Suppliers fetched successfully',
      suppliers
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!supplier) {
      return res.status(404).json({
        message: 'Supplier not found'
      });
    }

    res.status(200).json({
      message: 'Supplier updated successfully',
      supplier
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        message: 'Supplier not found'
      });
    }

    res.status(200).json({
      message: 'Supplier deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier
};