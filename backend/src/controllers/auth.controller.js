const jwt = require('jsonwebtoken');
const config = require('../config');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const crypto = require('crypto');
const { Op } = require('sequelize');

// Mock user database for development
const mockUsers = {
  'user@example.com': {
    id: '1',
    email: 'user@example.com',
    password_hash: '$2a$10$xLDnUqGXO2qTkUcWLFc1uuJ3VvAKyUNH8y2FXeJdaW6UxFoLfqC3i', // 'password'
    first_name: 'Test',
    last_name: 'User',
    user_type: 'job_seeker',
    verified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

// Helper function to validate password
const validatePassword = (plainPassword, hashedPassword) => {
  // In a real application, you would use bcrypt.compare
  // For mockup, just check if the password is 'password'
  return plainPassword === 'password';
};

// Generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

// Send response with token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  
  // Convert Sequelize model to plain object if needed
  const userObj = user.toJSON ? user.toJSON() : user;
  
  res.status(statusCode).json({
    status: 'success',
    token,
    user: userObj
  });
};

// Register a new user
exports.register = async (req, res, next) => {
  try {
    logger.info('Registration attempt with data:', JSON.stringify(req.body, null, 2));
    
    const { email, password, firstName, lastName, userType } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      logger.warn(`Registration failed: User already exists with email ${email}`);
      return next(new AppError('User already exists with this email', 400));
    }
    
    // Validate password length
    if (!password || password.length < 8) {
      return next(new AppError('Password must be at least 8 characters long', 400));
    }
    
    try {
      // Generate password hash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create new user in the database
      logger.info(`Creating new user with email: ${email}`);
      logger.debug('User data being created:', {
        email,
        first_name: firstName,
        last_name: lastName,
        user_type: userType || 'job_seeker'
      });
      
      const newUser = await User.create({
        email,
        password_hash: hashedPassword, // Set password_hash directly
        first_name: firstName,
        last_name: lastName,
        user_type: userType || 'job_seeker',
        verified: false
      });
      
      // Create and send token
      logger.info(`User created successfully with ID: ${newUser.id}`);
      createSendToken(newUser, 201, res);
    } catch (validationError) {
      logger.error('User creation validation error details:', {
        name: validationError.name,
        message: validationError.message,
        errors: validationError.errors,
        stack: validationError.stack
      });
      return next(new AppError(validationError.message, 400));
    }
  } catch (error) {
    logger.error('Registration error details:', {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    logger.info('Login attempt with data:', JSON.stringify(req.body, null, 2));
    
    const { email, password } = req.body;
    
    // Check if email and password exist
    if (!email || !password) {
      logger.warn('Login failed: Missing email or password');
      return next(new AppError('Please provide email and password', 400));
    }
    
    // Check if user exists and get password
    const user = await User.findOne({ 
      where: { email },
      attributes: { include: ['password_hash'] } // Include password hash for verification
    });
    
    if (!user) {
      logger.warn(`Login failed: No user found with email ${email}`);
      return next(new AppError('Incorrect email or password', 401));
    }
    
    // Check if password is correct
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      logger.warn(`Login failed: Invalid password for email ${email}`);
      return next(new AppError('Incorrect email or password', 401));
    }
    
    // Send token to client
    logger.info(`User logged in successfully with ID: ${user.id}`);
    createSendToken(user, 200, res);
  } catch (error) {
    logger.error('Login error details:', {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    next(error);
  }
};

// Get current user
exports.getCurrentUser = async (req, res, next) => {
  try {
    // req.user should be set by the protect middleware
    if (!req.user) {
      return next(new AppError('User not found or not authenticated', 401));
    }
    
    // Return the user object attached by the middleware
    const user = { ...req.user };
    // Optionally remove sensitive fields if needed, e.g., password hash if it exists
    // delete user.password_hash; 
    
    res.status(200).json({
      status: 'success',
      user // Send the user object directly
    });
  } catch (error) {
    logger.error('Get current user error:', error);
    next(error);
  }
};

// Update password
exports.updatePassword = async (req, res, next) => {
  try {
    // Mock implementation
    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
      token: signToken('1')
    });
  } catch (error) {
    logger.error('Update password error details:', {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
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
    
    // In a real application, you would send an email
    // For now, we'll just simulate success
    res.status(200).json({
      status: 'success',
      message: 'Password reset instructions sent to email'
    });
  } catch (error) {
    logger.error('Forgot password error details:', {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    next(error);
  }
};

// LinkedIn authentication callback
exports.linkedinCallback = async (req, res, next) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return next(new AppError('Authorization code is required', 400));
    }
    
    // Exchange authorization code for access token
    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.linkedin.callbackUrl,
        client_id: config.linkedin.clientId,
        client_secret: config.linkedin.clientSecret
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const { access_token } = tokenResponse.data;
    
    // Get user profile from LinkedIn
    const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    
    // Get user email from LinkedIn
    const emailResponse = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    
    const linkedinId = profileResponse.data.id;
    const firstName = profileResponse.data.localizedFirstName;
    const lastName = profileResponse.data.localizedLastName;
    const email = emailResponse.data.elements[0]['handle~'].emailAddress;
    
    // Check if user exists with this LinkedIn ID or email
    let user = await User.findOne({
      where: {
        [Op.or]: [
          { linkedin_id: linkedinId },
          { email }
        ]
      }
    });
    
    if (user) {
      // Update existing user
      user.linkedin_id = linkedinId;
      user.linkedin_verified = true;
      
      // If some fields are missing, update from LinkedIn
      if (!user.first_name) user.first_name = firstName;
      if (!user.last_name) user.last_name = lastName;
      
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        first_name: firstName,
        last_name: lastName,
        email,
        linkedin_id: linkedinId,
        linkedin_verified: true,
        // Generate a random password that the user can change later
        password: crypto.randomBytes(16).toString('hex'),
        role: 'user',
        status: 'active',
        email_verified: true // Since we got the email from LinkedIn, we can trust it
      });
    }
    
    // Generate token
    const token = generateToken(user.id);
    
    // Set cookie
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    };
    
    res.cookie('jwt', token, cookieOptions);
    
    // Redirect to frontend with token
    res.redirect(`${config.frontendUrl}/auth/linkedin/callback?token=${token}`);
    
  } catch (error) {
    logger.error('LinkedIn callback error:', error);
    next(new AppError('LinkedIn authentication failed', 401));
  }
}; 