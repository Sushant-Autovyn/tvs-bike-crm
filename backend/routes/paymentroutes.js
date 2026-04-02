const express = require('express');
const authMiddleware = require('../middleware/authmiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createPayment,
  getPayments,
  generateInvoicePDF
} = require('../controllers/paymentcontroller');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'accountant', 'sales-executive', 'service-advisor', 'mechanic'),
  createPayment
);

router.get(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'accountant', 'sales-executive', 'service-advisor', 'mechanic'),
  getPayments
);

router.get(
  '/pdf/:paymentId',
  authMiddleware,
  roleMiddleware('admin', 'accountant', 'sales-executive'),
  generateInvoicePDF
);

module.exports = router;