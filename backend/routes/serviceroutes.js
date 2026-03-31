const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const {
  createService,
  getServices,
  updateStatus
} = require('../controllers/servicecontroller');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'service-advisor'),
  createService
);

router.get(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'service-advisor', 'mechanic'),
  getServices
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'mechanic'),
  updateStatus
);

module.exports = router;