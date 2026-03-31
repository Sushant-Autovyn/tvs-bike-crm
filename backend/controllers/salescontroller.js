const Sale = require('../models/sales');
const Customer = require('../models/customer');
const Bike = require('../models/bike');
const createNotification = require('../utils/createnotification');

const createSale = async (req, res) => {
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

    if (bike.stock < quantity) {
      return res.status(400).json({
        message: 'Not enough stock available'
      });
    }

    const price = bike.price;
    const totalAmount = price * quantity;

    const sale = await Sale.create({
      customerId,
      bikeId,
      quantity,
      price,
      totalAmount,
      soldBy: req.user.userId
    });
    await createNotification(
  'New Sale',
  `Bike sold to customer`,
  'sale'
);

    bike.stock = bike.stock - quantity;
    await bike.save();

    res.status(201).json({
      message: 'Sale created successfully',
      sale
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('customerId', 'name phone')
      .populate('bikeId', 'brand modelName price')
      .populate('soldBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Sales fetched successfully',
      sales
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Debug endpoint to count sales
const countSales = async (req, res) => {
  try {
    const count = await Sale.countDocuments();
    const sales = await Sale.find().limit(5);
    
    res.status(200).json({
      message: 'Sales count',
      count: count,
      sampleSales: sales
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createSale,
  getSales,
  countSales
};