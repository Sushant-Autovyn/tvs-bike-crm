const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier
} = require('../controllers/suppliercontroller');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware('admin'), getSuppliers);
router.post('/', authMiddleware, roleMiddleware('admin'), createSupplier);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateSupplier);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteSupplier);

module.exports = router;