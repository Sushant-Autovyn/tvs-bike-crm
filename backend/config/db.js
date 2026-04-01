const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Production vs Development environment handling
    const isProduction = process.env.NODE_ENV === 'production';
    
    let MONGO_URI;
    
    if (isProduction) {
      // Production: Only use Atlas, no fallback
      MONGO_URI = process.env.MONGO_URI;
      if (!MONGO_URI) {
        throw new Error('MONGO_URI environment variable is required in production');
      }
      console.log('🚀 Production Mode: Connecting to MongoDB Atlas');
    } else {
      // Development: Try Atlas first, then local fallback
      MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URI_LOCAL || 'mongodb://127.0.0.1:27017/bikecrm_local';
      console.log('🔧 Development Mode: Connecting to MongoDB...');
    }
    
    console.log(`📡 Target: ${MONGO_URI.includes('mongodb.net') ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}`);
    console.log(`🔗 Connection URI: ${MONGO_URI.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials

    // Enhanced connection options for better Atlas compatibility
    const connectionOptions = {
      serverSelectionTimeoutMS: isProduction ? 15000 : 5000, // Longer timeout in production
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      connectTimeoutMS: 10000
    };

    if (isProduction) {
      // Production: Direct connect, no fallback
      await mongoose.connect(MONGO_URI, connectionOptions);
      console.log('✅ MongoDB Atlas connected successfully (Production)');
    } else {
      // Development: Try Atlas first, then local fallback
      try {
        await mongoose.connect(MONGO_URI, connectionOptions);
        console.log(`✅ MongoDB connected successfully (${MONGO_URI.includes('mongodb.net') ? 'Atlas' : 'Local'})`);
      } catch (atlasError) {
        if (MONGO_URI.includes('mongodb.net')) {
          console.log('⚠️ Atlas connection failed, trying local fallback...');
          console.log(`Atlas Error: ${atlasError.message}`);
          
          const localURI = process.env.MONGO_URI_LOCAL || 'mongodb://127.0.0.1:27017/bikecrm_local';
          await mongoose.connect(localURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 30000
          });
          console.log('✅ Local MongoDB connected successfully (Fallback)');
        } else {
          throw atlasError;
        }
      }
    }
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code || 'N/A'}`);
    
    if (error.message.includes('ETIMEOUT') || error.message.includes('querySrv')) {
      console.error('💡 Possible fixes:');
      console.error('   1. Check if MongoDB Atlas cluster is paused');
      console.error('   2. Verify Network Access (IP whitelist) in Atlas');
      console.error('   3. Ensure correct credentials in MONGO_URI');
      console.error('   4. Check internet connectivity');
    }
    
    if (process.env.NODE_ENV === 'production') {
      console.error('🚨 Production deployment failed - check Atlas configuration');
      process.exit(1);
    } else {
      console.error('⚠️ Development: Consider starting local MongoDB');
      process.exit(1);
    }
  }
};

module.exports = connectDB;