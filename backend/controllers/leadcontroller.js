const Lead = require('../models/lead');
const Customer = require('../models/customer');

const createLead = async (req, res) => {
  try {
    const { name, phone, email, interestedBike, source, notes } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        message: 'Name and phone are required'
      });
    }

    const lead = await Lead.create({
      name,
      phone,
      email,
      interestedBike,
      source,
      notes,
      assignedTo: req.user.userId
    });

    res.status(201).json({
      message: 'Lead created successfully',
      lead
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate('assignedTo', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Leads fetched successfully',
      leads
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      message: 'Lead status updated successfully',
      lead
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const convertLeadToCustomer = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: 'Lead not found'
      });
    }

    if (lead.status === 'converted') {
      return res.status(400).json({
        message: 'Lead already converted'
      });
    }

    const customer = await Customer.create({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      notes: `Converted from lead. Interested bike: ${lead.interestedBike || '-'}`
    });

    lead.status = 'converted';
    await lead.save();

    res.status(201).json({
      message: 'Lead converted to customer successfully',
      customer,
      lead
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createLead,
  getLeads,
  updateLeadStatus,
  convertLeadToCustomer
};