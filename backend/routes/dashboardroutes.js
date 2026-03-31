const express = require('express');
const authMiddleware = require('../middleware/authmiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { getDashboardStats } = require('../controllers/dashboardcontroller');

const router = express.Router();

// Public dashboard stats (no auth required)
router.get('/stats', getDashboardStats);

module.exports = router;