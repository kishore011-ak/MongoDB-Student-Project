const mongoose = require('mongoose');

/**
 * Mask sensitive credentials from MongoDB URI for safe logging
 * @param {string} uri 
 * @returns {string} Safe masked URI
 */
const maskMongoURI = (uri) => {
  if (!uri) return 'Not Provided';
  try {
    return uri.replace(/\/\/(.*):(.*)@/, '//***:***@');
  } catch {
    return 'Masked-URI';
  }
};

/**
 * Connect to MongoDB Atlas
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('\n⚠️  WARNING: MONGODB_URI environment variable is missing.');
    console.warn('ℹ️  Please set MONGODB_URI in your .env file to connect to MongoDB Atlas.');
    console.warn('ℹ️  See .env.example for details.\n');
    return false;
  }

  try {
    console.log(`🔌 Attempting connection to MongoDB Atlas (${maskMongoURI(uri)})...`);
    
    // Connect to MongoDB Atlas using Mongoose
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
      socketTimeoutMS: 45000
    });

    console.log(`✅ MongoDB Atlas Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`💡 Tip: Verify your Atlas username, password, IP whitelist (Network Access), and database name.`);
    return false;
  }
};

/**
 * Get current database connection status
 */
const getConnectionStatus = () => {
  const stateMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  const readyState = mongoose.connection.readyState;
  return {
    state: stateMap[readyState] || 'Unknown',
    isConnected: readyState === 1,
    database: mongoose.connection.name || 'Not Selected',
    host: mongoose.connection.host ? mongoose.connection.host.split('.')[0] + '...mongodb.net' : 'Disconnected'
  };
};

module.exports = {
  connectDB,
  getConnectionStatus,
  maskMongoURI
};
