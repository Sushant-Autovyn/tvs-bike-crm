const express = require('express');
const authMiddleware = require('../middleware/authmiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const {
  createBike,
  getBikes,
  getBikeById,
  updateBike,
  deleteBike
} = require('../controllers/bikecontroller');

const router = express.Router();

// Restore auth middleware with demo token support
router.post('/', authMiddleware, roleMiddleware('admin', 'sales-executive'), createBike);
router.get('/', authMiddleware, roleMiddleware('admin', 'sales-executive'), getBikes);
router.get('/:id', authMiddleware, roleMiddleware('admin', 'sales-executive'), getBikeById);
router.put('/:id', authMiddleware, roleMiddleware('admin', 'sales-executive'), updateBike);
router.delete('/:id', authMiddleware, roleMiddleware('admin', 'sales-executive'), deleteBike);

module.exports = router;