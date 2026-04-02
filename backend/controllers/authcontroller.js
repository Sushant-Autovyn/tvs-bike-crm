const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const generateToken = (user) => {
  console.log('🔑 Generating token for user:', user.email);
  
  // Direct hardcoded secret to test
  const jwtSecret = 'your_super_secret_key_123';
  
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role
    },
    jwtSecret,
    { expiresIn: '7d' }
  );
};

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required'
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'admin'
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    console.log('📝 Login attempt received:', { email: req.body.email, passwordLength: req.body.password?.length });
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Missing credentials');
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    console.log('🔍 Looking for user with email:', email);
    const user = await User.findOne({ email });
    console.log('👤 User found:', user ? 'YES' : 'NO');

    if (!user) {
      console.log('❌ User not found');
      return res.status(400).json({
        message: 'Invalid email or password'
      });
    }

    console.log('🔐 Comparing passwords...');
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log('🔐 Password match:', isPasswordMatch ? 'YES' : 'NO');

    if (!isPasswordMatch) {
      console.log('❌ Password mismatch');
      return res.status(400).json({
        message: 'Invalid email or password'
      });
    }

    console.log('✅ Authentication successful, generating token...');
    const token = generateToken(user);
    console.log('🎫 Token generated successfully');

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('💥 Login error:', error.message);
    res.status(500).json({
      message: error.message
    });
  }
};

// PROFILE
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.status(200).json({
      message: 'Profile fetched successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile
};