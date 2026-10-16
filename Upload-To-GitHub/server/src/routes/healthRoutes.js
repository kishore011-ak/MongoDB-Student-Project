const express = require('express');
const router = express.Router();
const { getConnectionStatus } = require('../config/database');

/**
 * @desc   Health check endpoint to test server & MongoDB connectivity
 * @route  GET /api/health
 */
router.get('/', (req, res) => {
  const dbStatus = getConnectionStatus();
  const isHealthy = dbStatus.isConnected;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'UP' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      provider: 'MongoDB Atlas',
      status: dbStatus.state,
      connected: dbStatus.isConnected,
      databaseName: dbStatus.database,
      maskedHost: dbStatus.host
    },
    system: {
      nodeVersion: process.version,
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    }
  });
});

module.exports = router;
