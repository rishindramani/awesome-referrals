const statsService = require('../services/stats.service');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

/**
 * Get platform-wide statistics
 */
exports.getPlatformStats = catchAsync(async (req, res) => {
  const stats = await statsService.getPlatformStats();
  res.json(stats);
});

/**
 * Get user statistics
 */
exports.getUserStats = catchAsync(async (req, res) => {
  const { period } = req.query;
  const userId = req.user.id;
  
  const stats = await statsService.getUserStats(userId, period);
  res.json(stats);
});

/**
 * Get referral statistics
 */
exports.getReferralStats = catchAsync(async (req, res) => {
  const { period } = req.query;
  
  const stats = await statsService.getReferralStats(period);
  res.json(stats);
});

/**
 * Get job statistics
 */
exports.getJobStats = catchAsync(async (req, res) => {
  const { period } = req.query;
  
  const stats = await statsService.getJobStats(period);
  res.json(stats);
});

/**
 * Get dashboard statistics (all stats in one call)
 */
exports.getDashboardStats = catchAsync(async (req, res) => {
  const { period } = req.query;
  const userId = req.user.id;
  
  const stats = await statsService.getDashboardStats(userId, period);
  res.json(stats);
}); 