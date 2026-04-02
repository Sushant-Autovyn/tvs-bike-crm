const express = require('express');
// Disable auth for demo consistency
// const authMiddleware = require('../middleware/authmiddleware');
// const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createLead,
  getLeads,
  updateLeadStatus,
  convertLeadToCustomer
} = require('../controllers/leadcontroller');

const router = express.Router();

// Remove auth middleware for demo
router.post('/', createLead);
router.get('/', getLeads);
router.put('/:id/status', updateLeadStatus);
router.post('/:id/convert', convertLeadToCustomer);

module.exports = router;