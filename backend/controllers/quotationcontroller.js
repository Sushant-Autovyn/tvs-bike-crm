const Quotation = require('../models/quotation');
const Customer = require('../models/customer');
const Bike = require('../models/bike');
const Sales = require('../models/sales');

const createQuotation = async (req, res) => {
  try {
    const { customerId, bikeId, quantity } = req.body;

    if (!customerId || !bikeId || !quantity) {
      return res.status(400).json({
        message: 'Customer, bike and quantity are required'
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        message: 'Customer not found'
      });
    }

    const bike = await Bike.findById(bikeId);
    if (!bike) {
      return res.status(404).json({
        message: 'Bike not found'
      });
    }

    const price = bike.price;
    const totalAmount = price * quantity;

    const quotation = await Quotation.create({
      customerId,
      bikeId,
      quantity,
      price,
      totalAmount,
      createdBy: req.user.userId
    });

    res.status(201).json({
      message: 'Quotation created successfully',
      quotation
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find()
      .populate('customerId', 'name phone')
      .populate('bikeId', 'brand modelName price')
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Quotations fetched successfully',
      quotations
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateQuotationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!quotation) {
      return res.status(404).json({
        message: 'Quotation not found'
      });
    }

    res.status(200).json({
      message: 'Quotation status updated successfully',
      quotation
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const convertToSale = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);

    if (!quotation) {
      return res.status(404).json({
        message: 'Quotation not found'
      });
    }

    if (quotation.status !== 'approved') {
      return res.status(400).json({
        message: 'Only approved quotation can be converted'
      });
    }

    if (quotation.isConverted) {
      return res.status(400).json({
        message: 'Quotation already converted'
      });
    }

    const bike = await Bike.findById(quotation.bikeId);

    if (!bike) {
      return res.status(404).json({
        message: 'Bike not found'
      });
    }

    if (bike.stock < quotation.quantity) {
      return res.status(400).json({
        message: 'Not enough stock available'
      });
    }

    const sale = await Sales.create({
      customerId: quotation.customerId,
      bikeId: quotation.bikeId,
      quantity: quotation.quantity,
      price: quotation.price,
      totalAmount: quotation.totalAmount,
      soldBy: req.user.userId
    });

    quotation.isConverted = true;
    await quotation.save();

    bike.stock = bike.stock - quotation.quantity;
    await bike.save();

    res.status(201).json({
      message: 'Converted to sale successfully',
      sale
    });
  } catch (error) {
    console.log('Convert to sale error:', error.message);
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createQuotation,
  getQuotations,
  updateQuotationStatus,
  convertToSale
};