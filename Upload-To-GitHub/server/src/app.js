const express = require('express');
const cors = require('cors');
const path = require('path');

const studentRoutes = require('./routes/studentRoutes');
const statsRoutes = require('./routes/statsRoutes');
const healthRoutes = require('./routes/healthRoutes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

// Security and utility middleware
app.use(cors({
  origin: '*', // Allows local testing and flexible client hosting
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request body parser with safe payload limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Serve frontend static files
const clientPath = path.resolve(__dirname, '../../client');
app.use(express.static(clientPath));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/stats', statsRoutes);

// Root route fallback to serve frontend dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Middleware for unmatched API routes
app.use('/api/*', notFound);

// Centralized error handling
app.use(errorHandler);

module.exports = app;
