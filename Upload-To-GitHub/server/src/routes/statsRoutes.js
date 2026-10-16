const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/statsController');

// Map stats route
router.get('/', getDashboardStats);

module.exports = router;
