const express = require('express');
// Disable auth for demo consistency
// const authMiddleware = require('../middleware/authmiddleware');  
// const roleMiddleware = require('../middleware/roleMiddleware');
const { createSale, getSales, countSales } = require('../controllers/salescontroller');

const router = express.Router();

// Remove auth middleware for demo
router.post('/', createSale);
router.get('/', getSales);
router.get('/count', countSales);

module.exports = router;