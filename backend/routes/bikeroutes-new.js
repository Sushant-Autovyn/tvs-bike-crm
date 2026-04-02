const express = require('express');
const {
  createBike,
  getBikes,
  getBikeById,
  updateBike,
  deleteBike
} = require('../controllers/bikecontroller');

const router = express.Router();

router.post('/', createBike);
router.get('/', getBikes);
router.get('/:id', getBikeById);
router.put('/:id', updateBike);
router.delete('/:id', deleteBike);

module.exports = router;