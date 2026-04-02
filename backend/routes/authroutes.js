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

// Simple test endpoint without JWT
router.get('/jwt-test', (req, res) => {
  console.log('🧪 Simple test endpoint called');
  res.json({ 
    message: 'Simple test successful',
    jwtSecretLoaded: !!process.env.JWT_SECRET
  });
});

// Simple test login endpoint
router.post('/test-login', (req, res) => {
  console.log('🧪 TEST LOGIN ENDPOINT HIT!');
  try {
    const testToken = 'test-token-12345';
    res.json({
      message: 'Test login successful',
      token: testToken,
      user: { id: 1, email: 'test@test.com', role: 'admin' }
    });
  } catch (error) {
    console.error('❌ Test login error:', error.message);
    res.status(500).json({ message: 'Test login failed', error: error.message });
  }
});

router.post('/register', registerUser);
router.post('/login', (req, res, next) => {
  console.log('🔥 LOGIN ROUTE HIT!');
  console.log('🔥 Request body:', req.body);
  loginUser(req, res, next);
});
router.get('/profile', authMiddleware, getProfile);

module.exports = router;