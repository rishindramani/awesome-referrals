const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');
const config = require('../config');
const { User } = require('../models');

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
    
    // 2) Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // 3) Check if user still exists
    const currentUser = await User.findByPk(decoded.id);
    
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }
    
    // 4) Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again.', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Your token has expired. Please log in again.', 401));
    }
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