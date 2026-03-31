const Service = require('../models/service');

const createService = async (req, res) => {
  try {
    const { customerId, bikeId, issue } = req.body;

    if (!customerId || !bikeId || !issue) {
      return res.status(400).json({
        message: 'Customer, bike and issue are required'
      });
    }

    const service = await Service.create({
      customerId,
      bikeId,
      issue
    });

    res.status(201).json({
      message: 'Service booking created',
      service
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate('customerId', 'name phone')
      .populate('bikeId', 'brand modelName')
      .populate('assignedTo', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Services fetched',
      services
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({
      message: 'Status updated',
      service
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createService,
  getServices,
  updateStatus
};