const express = require('express');
// Disable auth for demo consistency
// const authMiddleware = require('../middleware/authmiddleware');
// const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createQuotation,
  getQuotations,
  updateQuotationStatus,
  convertToSale
} = require('../controllers/quotationcontroller');

const router = express.Router();

// Remove auth middleware for demo
router.post('/', createQuotation);
router.get('/', getQuotations);
router.put('/:id', updateQuotationStatus);
router.post('/convert/:id', convertToSale);

module.exports = router;