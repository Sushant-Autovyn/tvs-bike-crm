const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { createSale, getSales, countSales } = require('../controllers/salescontroller');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'sales-executive'),
  createSale
);

router.get(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'sales-executive', 'accountant', 'service-advisor', 'mechanic'),
  getSales
);

// Temporary test endpoint without role restriction
router.get(
  '/test',
  authMiddleware,
  getSales
);

// Debug endpoint - no role restriction for testing
router.get(
  '/debug',
  authMiddleware,
  getSales  
);

// Debug endpoint to count sales
router.get(
  '/count',
  authMiddleware,
  countSales
);

module.exports = router;