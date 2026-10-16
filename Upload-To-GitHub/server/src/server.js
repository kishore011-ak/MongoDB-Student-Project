const path = require('path');
const dotenv = require('dotenv');

// Load .env from server directory first, fallback to root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.PORT || 5000;

// Initialize server and database connection
const startServer = async () => {
  console.log('====================================================');
  console.log('🚀 STUDENT MANAGEMENT SYSTEM - BACKEND INITIALIZING');
  console.log('====================================================');
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📦 Node.js Version: ${process.version}`);

  // Connect to MongoDB Atlas Cloud Database
  await connectDB();

  // Start Express HTTP Server
  const server = app.listen(PORT, () => {
    console.log(`\n🎉 Server running successfully on port ${PORT}!`);
    console.log(`🌐 Local Web Dashboard: http://localhost:${PORT}`);
    console.log(`🩺 Health API Check:    http://localhost:${PORT}/api/health`);
    console.log(`📚 Students API:        http://localhost:${PORT}/api/students`);
    console.log(`📊 Stats API:           http://localhost:${PORT}/api/stats\n`);
  });

  // Handle graceful shutdown
  const handleShutdown = (signal) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('🔒 Express HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
};

startServer();
