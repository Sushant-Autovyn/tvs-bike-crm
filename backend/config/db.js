const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try cloud MongoDB first, then fallback to local
    let MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bikecrm_local';
    
    console.log('Connecting to MongoDB...');
    console.log(`Attempting connection to: ${MONGO_URI.includes('mongodb.net') ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}`);

    try {
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000, // 5 second timeout
      });
      console.log('✅ MongoDB connected successfully');
    } catch (cloudError) {
      if (MONGO_URI.includes('mongodb.net')) {
        console.log('⚠️ Cloud MongoDB failed, trying local fallback...');
        MONGO_URI = process.env.MONGO_URI_LOCAL || 'mongodb://127.0.0.1:27017/bikecrm_local';
        await mongoose.connect(MONGO_URI);
        console.log('✅ Local MongoDB connected successfully');
      } else {
        throw cloudError;
      }
    }
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('💡 Make sure MongoDB is running or check your connection string');
    process.exit(1);
  }
};

module.exports = connectDB;