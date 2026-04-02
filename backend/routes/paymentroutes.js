const express = require('express');
// Disable auth for demo consistency
// const authMiddleware = require('../middleware/authmiddleware');
// const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createPayment,
  getPayments,
  generateInvoicePDF
} = require('../controllers/paymentcontroller');

const router = express.Router();

// Remove auth middleware for demo
router.post('/', createPayment);
router.get('/', getPayments);

module.exports = router;