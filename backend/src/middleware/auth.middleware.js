const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');
const config = require('../config');
const logger = require('../utils/logger');

// Mock user for development
const mockUser = {
  id: '1',
  email: 'user@example.com',
  first_name: 'Test',
  last_name: 'User',
  user_type: 'job_seeker',
  verified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Middleware to protect routes that require authentication
exports.protect = async (req, res, next) => {
  try {
    // 1) Get token and check if it exists
    let token;
    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }
    
    // Log token for debugging
    logger.debug(`Received token: ${token}`);
    
    try {
      // 2) Verify token
      const decoded = jwt.verify(token, config.jwt.secret);
      logger.debug(`Token verified for user ID: ${decoded.id}`);
      
      // In development mode, use mock user
      if (config.nodeEnv === 'development') {
        req.user = mockUser;
        return next();
      }
      
      // In production, would check if user exists in database
      // ...
      
    } catch (jwtError) {
      logger.error('JWT verification error:', jwtError);
      if (jwtError.name === 'JsonWebTokenError') {
        return next(new AppError('Invalid token. Please log in again.', 401));
      }
      if (jwtError.name === 'TokenExpiredError') {
        return next(new AppError('Your token has expired. Please log in again.', 401));
      }
      return next(jwtError);
    }
    
    // Grant access to protected route
    next();
  } catch (error) {
    logger.error('Protect middleware error:', error);
    next(error);
  }
};

// Middleware to restrict access to certain user types
exports.restrictTo = (...userTypes) => {
  return (req, res, next) => {
    if (!userTypes.includes(req.user.user_type)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

// Middleware to check if user is verified
exports.isVerified = (req, res, next) => {
  if (!req.user.verified) {
    return next(new AppError('Your account is not verified. Please verify your account to access this feature.', 403));
  }
  next();
}; 