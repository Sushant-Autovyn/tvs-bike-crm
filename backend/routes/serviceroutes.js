const express = require('express');
// Disable auth for demo consistency
// const authMiddleware = require('../middleware/authmiddleware');
// const roleMiddleware = require('../middleware/roleMiddleware');

const {
  createService,
  getServices,
  updateStatus
} = require('../controllers/servicecontroller');

const router = express.Router();

// Remove auth middleware for demo
router.post('/', createService);
router.get('/', getServices);
router.put('/:id/status', updateStatus);

module.exports = router;