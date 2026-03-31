const express = require('express');
const {
  registerUser,
  loginUser,
  getProfile
} = require('../controllers/authcontroller');
const authMiddleware = require('../middleware/authmiddleware');

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Auth routes are working!', 
    timestamp: new Date().toISOString() 
  });
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;