const express = require('express');
const authMiddleware = require('../middleware/authmiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createLead,
  getLeads,
  updateLeadStatus,
  convertLeadToCustomer
} = require('../controllers/leadcontroller');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'sales-executive'),
  createLead
);

router.get(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'sales-executive'),
  getLeads
);

router.put(
  '/:id/status',
  authMiddleware,
  roleMiddleware('admin', 'sales-executive'),
  updateLeadStatus
);

router.post(
  '/:id/convert',
  authMiddleware,
  roleMiddleware('admin', 'sales-executive'),
  convertLeadToCustomer
);

module.exports = router;