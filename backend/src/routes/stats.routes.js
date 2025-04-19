const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { protect } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(protect);

// Get platform-wide statistics
router.get('/platform', statsController.getPlatformStats);

// Get user's statistics
router.get('/user', statsController.getUserStats);

// Get referral statistics
router.get('/referrals', statsController.getReferralStats);

// Get job statistics
router.get('/jobs', statsController.getJobStats);

// Get all dashboard statistics in one call
router.get('/dashboard', statsController.getDashboardStats);

module.exports = router; 