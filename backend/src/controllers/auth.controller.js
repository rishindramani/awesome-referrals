const jwt = require('jsonwebtoken');
const { User, UserProfile } = require('../models');
const config = require('../config');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// Generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

// Send response with token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  
  // Remove password from output
  user.password_hash = undefined;
  
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, userType } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new AppError('User already exists with this email', 400));
    }
    
    // Create new user
    const user = await User.create({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      user_type: userType || 'job_seeker'
    });
    
    // Create user profile
    await UserProfile.create({
      user_id: user.id
    });
    
    // Create and send token
    createSendToken(user, 201, res);
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }
    
    // Check if user exists && password is correct
    const user = await User.findOne({ where: { email } });
    
    if (!user || !(await user.validatePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }
    
    // Send token to client
    createSendToken(user, 200, res);
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

// Get current user
exports.getCurrentUser = async (req, res, next) => {
  try {
    // User is already available in req due to protect middleware
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    logger.error('Get current user error:', error);
    next(error);
  }
};

// Update password
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get user from database
    const user = await User.findByPk(req.user.id);
    
    // Check if current password is correct
    if (!(await user.validatePassword(currentPassword))) {
      return next(new AppError('Your current password is incorrect', 401));
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    // Log user in, send JWT
    createSendToken(user, 200, res);
  } catch (error) {
    logger.error('Update password error:', error);
    next(error);
  }
};

// Forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return next(new AppError('Please provide your email address', 400));
    }
    
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return next(new AppError('There is no user with this email address', 404));
    }
    
    // In a real application, you would:
    // 1. Generate a reset token
    // 2. Send it to the user's email
    // 3. Store the hashed token in the database
    
    // For now, we'll just simulate success
    res.status(200).json({
      status: 'success',
      message: 'Password reset instructions sent to email'
    });
  } catch (error) {
    logger.error('Forgot password error:', error);
    next(error);
  }
};

// LinkedIn authentication callback
exports.linkedinCallback = async (req, res, next) => {
  try {
    // In a real application, you would:
    // 1. Receive the LinkedIn code
    // 2. Exchange it for an access token
    // 3. Fetch the user profile from LinkedIn
    // 4. Create or update a user in your database
    // 5. Set the user as verified if the LinkedIn profile is valid
    
    // For now, we'll just simulate success
    res.status(200).json({
      status: 'success',
      message: 'LinkedIn authentication successful'
    });
  } catch (error) {
    logger.error('LinkedIn callback error:', error);
    next(error);
  }
}; 