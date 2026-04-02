const express = require('express');
const authMiddleware = require('../middleware/authmiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  getStaff,
  createStaff,
  updateStaffRole,
  deleteStaff
} = require('../controllers/staffcontroller');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware('admin'), getStaff);
router.post('/', authMiddleware, roleMiddleware('admin'), createStaff);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateStaffRole);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteStaff);

module.exports = router;