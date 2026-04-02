const express = require('express');
const authMiddleware = require('../middleware/authmiddleware');

const {
  getInventory,
  updateStock,
  getLowStock
} = require('../controllers/inventorycontroller');

const router = express.Router();

router.get('/', authMiddleware, getInventory);
router.put('/:id', authMiddleware, updateStock);
router.get('/low-stock', authMiddleware, getLowStock);

module.exports = router;