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

// JWT Test endpoint
router.get('/jwt-test', (req, res) => {
  console.log('🧪 JWT Test endpoint called');
  console.log('🔑 JWT_SECRET available:', process.env.JWT_SECRET ? 'YES' : 'NO');
  console.log('🔑 JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
  
  try {
    const jwt = require('jsonwebtoken');
    const testToken = jwt.sign({ test: 'data' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('✅ JWT generation successful');
    res.json({ 
      message: 'JWT test successful',
      tokenLength: testToken.length,
      jwtSecretLoaded: !!process.env.JWT_SECRET
    });
  } catch (error) {
    console.error('❌ JWT generation failed:', error.message);
    res.status(500).json({ 
      message: 'JWT test failed',
      error: error.message,
      jwtSecretLoaded: !!process.env.JWT_SECRET
    });
  }
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