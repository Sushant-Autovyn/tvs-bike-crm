const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createQuotation,
  getQuotations,
  updateQuotationStatus,
  convertToSale
} = require('../controllers/quotationcontroller');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'sales-executive'),
  createQuotation
);

router.get(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'sales-executive'),
  getQuotations
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'sales-executive'),
  updateQuotationStatus
);

router.post(
  '/convert/:id',
  authMiddleware,
  roleMiddleware('admin', 'sales-executive'),
  convertToSale
);

module.exports = router;