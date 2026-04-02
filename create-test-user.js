const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './backend/.env' });

// User schema (simplified version)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createTestUser() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.NODE_ENV === 'production' 
      ? process.env.MONGO_URI 
      : process.env.MONGO_URI_LOCAL || process.env.MONGO_URI;
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('✅ Test user already exists');
      console.log('Email: test@example.com');
      console.log('Password: password123');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Create test user
    const testUser = new User({
      name: 'Test Admin',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    await testUser.save();
    
    console.log('✅ Test user created successfully!');
    console.log('📧 Email: test@example.com');
    console.log('🔒 Password: password123');
    console.log('👤 Role: admin');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
  }
}

createTestUser();