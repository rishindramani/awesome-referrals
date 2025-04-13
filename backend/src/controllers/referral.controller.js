const ReferralRequest = require('../models/referralRequest.model');
const User = require('../models/user.model');
const Job = require('../models/job.model');
const Company = require('../models/company.model');
const AppError = require('../utils/appError');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

/**
 * Get all referral requests for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getReferralRequests = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    // Build query based on user role and status filter
    const query = {
      where: {},
      include: [
        {
          model: User,
          as: 'seeker',
          attributes: ['id', 'first_name', 'last_name', 'email', 'avatar_url']
        },
        {
          model: User,
          as: 'referrer',
          attributes: ['id', 'first_name', 'last_name', 'email', 'avatar_url']
        },
        {
          model: Job,
          include: [{ model: Company }]
        }
      ],
      offset,
      limit: parseInt(limit)
    };

    // Filter by status if provided
    if (status) {
      query.where.status = status;
    }

    // If user is not admin, filter by user's role (seeker or referrer)
    if (req.user.role !== 'admin') {
      if (req.user.role === 'seeker') {
        query.where.seeker_id = req.user.id;
      } else if (req.user.role === 'referrer') {
        query.where.referrer_id = req.user.id;
      }
    }

    // Get total count for pagination
    const count = await ReferralRequest.count({ where: query.where });
    
    // Get referral requests
    const referralRequests = await ReferralRequest.findAll(query);

    res.status(200).json({
      status: 'success',
      results: referralRequests.length,
      total: count,
      data: {
        referralRequests
      }
    });
  } catch (error) {
    logger.error('Error getting referral requests:', error);
    next(new AppError('Error getting referral requests', 500));
  }
};

/**
 * Get a single referral request by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getReferralRequest = async (req, res, next) => {
  try {
    const referralRequest = await ReferralRequest.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'seeker',
          attributes: ['id', 'first_name', 'last_name', 'email', 'avatar_url']
        },
        {
          model: User,
          as: 'referrer',
          attributes: ['id', 'first_name', 'last_name', 'email', 'avatar_url']
        },
        {
          model: Job,
          include: [{ model: Company }]
        }
      ]
    });

    if (!referralRequest) {
      return next(new AppError('Referral request not found', 404));
    }

    // Check if user has permission to view this referral
    if (
      req.user.role !== 'admin' &&
      req.user.id !== referralRequest.seeker_id &&
      req.user.id !== referralRequest.referrer_id
    ) {
      return next(new AppError('You do not have permission to view this referral request', 403));
    }

    res.status(200).json({
      status: 'success',
      data: {
        referralRequest
      }
    });
  } catch (error) {
    logger.error('Error getting referral request:', error);
    next(new AppError('Error getting referral request', 500));
  }
};

/**
 * Create a new referral request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createReferralRequest = async (req, res, next) => {
  try {
    // Extract data from request body
    const { job_id, referrer_id, message, resume_url } = req.body;

    // Check if job exists
    const job = await Job.findByPk(job_id);
    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    // Check if referrer exists and is a referrer
    const referrer = await User.findByPk(referrer_id);
    if (!referrer) {
      return next(new AppError('Referrer not found', 404));
    }

    if (referrer.role !== 'referrer' && referrer.role !== 'admin') {
      return next(new AppError('Selected user is not a referrer', 400));
    }

    // Check if user already requested a referral for this job
    const existingRequest = await ReferralRequest.findOne({
      where: {
        job_id,
        seeker_id: req.user.id,
        referrer_id
      }
    });

    if (existingRequest) {
      return next(new AppError('You have already requested a referral for this job from this referrer', 400));
    }

    // Create referral request
    const referralRequest = await ReferralRequest.create({
      job_id,
      seeker_id: req.user.id,
      referrer_id,
      message,
      resume_url,
      status: 'pending',
      created_at: new Date()
    });

    // Fetch the complete referral request with associations
    const completeReferralRequest = await ReferralRequest.findByPk(referralRequest.id, {
      include: [
        {
          model: User,
          as: 'seeker',
          attributes: ['id', 'first_name', 'last_name', 'email', 'avatar_url']
        },
        {
          model: User,
          as: 'referrer',
          attributes: ['id', 'first_name', 'last_name', 'email', 'avatar_url']
        },
        {
          model: Job,
          include: [{ model: Company }]
        }
      ]
    });

    // TODO: Send notification to referrer

    res.status(201).json({
      status: 'success',
      data: {
        referralRequest: completeReferralRequest
      }
    });
  } catch (error) {
    logger.error('Error creating referral request:', error);
    next(new AppError('Error creating referral request', 500));
  }
};

/**
 * Update a referral request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateReferralRequest = async (req, res, next) => {
  try {
    const referralRequest = await ReferralRequest.findByPk(req.params.id);

    if (!referralRequest) {
      return next(new AppError('Referral request not found', 404));
    }

    // Only allow seeker to update if pending and they are the seeker
    // Only allow referrer to update status and feedback
    if (req.user.role !== 'admin') {
      if (req.user.id === referralRequest.seeker_id) {
        // Seeker can only update message and resume_url if status is pending
        if (referralRequest.status !== 'pending') {
          return next(new AppError('Cannot update referral request that is not pending', 400));
        }
        
        // Seeker can only update these fields
        const allowedFields = ['message', 'resume_url'];
        Object.keys(req.body).forEach(key => {
          if (!allowedFields.includes(key)) {
            delete req.body[key];
          }
        });
      } else if (req.user.id === referralRequest.referrer_id) {
        // Referrer can only update status and feedback
        const allowedFields = ['status', 'feedback'];
        Object.keys(req.body).forEach(key => {
          if (!allowedFields.includes(key)) {
            delete req.body[key];
          }
        });
      } else {
        return next(new AppError('You do not have permission to update this referral request', 403));
      }
    }

    // If status is being updated, add status update date
    if (req.body.status && req.body.status !== referralRequest.status) {
      if (req.body.status === 'accepted') {
        req.body.accepted_at = new Date();
      } else if (req.body.status === 'rejected') {
        req.body.rejected_at = new Date();
      } else if (req.body.status === 'completed') {
        req.body.completed_at = new Date();
      }
    }

    // Update referral request
    await referralRequest.update(req.body);

    // Fetch updated referral request with associations
    const updatedReferralRequest = await ReferralRequest.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'seeker',
          attributes: ['id', 'first_name', 'last_name', 'email', 'avatar_url']
        },
        {
          model: User,
          as: 'referrer',
          attributes: ['id', 'first_name', 'last_name', 'email', 'avatar_url']
        },
        {
          model: Job,
          include: [{ model: Company }]
        }
      ]
    });

    // TODO: Send notification of status change

    res.status(200).json({
      status: 'success',
      data: {
        referralRequest: updatedReferralRequest
      }
    });
  } catch (error) {
    logger.error('Error updating referral request:', error);
    next(new AppError('Error updating referral request', 500));
  }
};

/**
 * Delete a referral request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deleteReferralRequest = async (req, res, next) => {
  try {
    const referralRequest = await ReferralRequest.findByPk(req.params.id);

    if (!referralRequest) {
      return next(new AppError('Referral request not found', 404));
    }

    // Check if user has permission to delete
    if (
      req.user.role !== 'admin' &&
      req.user.id !== referralRequest.seeker_id
    ) {
      return next(new AppError('You do not have permission to delete this referral request', 403));
    }

    // Only allow deletion if status is pending
    if (referralRequest.status !== 'pending' && req.user.role !== 'admin') {
      return next(new AppError('Cannot delete referral request that is not pending', 400));
    }

    await referralRequest.destroy();

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    logger.error('Error deleting referral request:', error);
    next(new AppError('Error deleting referral request', 500));
  }
};

/**
 * Get statistics about referral requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getReferralStats = async (req, res, next) => {
  try {
    let query = {};
    
    // If user is not admin, filter by user's role
    if (req.user.role !== 'admin') {
      if (req.user.role === 'seeker') {
        query = { seeker_id: req.user.id };
      } else if (req.user.role === 'referrer') {
        query = { referrer_id: req.user.id };
      }
    }

    // Get counts by status
    const totalCount = await ReferralRequest.count({ where: query });
    const pendingCount = await ReferralRequest.count({ 
      where: { ...query, status: 'pending' } 
    });
    const acceptedCount = await ReferralRequest.count({ 
      where: { ...query, status: 'accepted' } 
    });
    const rejectedCount = await ReferralRequest.count({ 
      where: { ...query, status: 'rejected' } 
    });
    const completedCount = await ReferralRequest.count({ 
      where: { ...query, status: 'completed' } 
    });

    // Get recent activity
    const recentActivity = await ReferralRequest.findAll({
      where: query,
      limit: 5,
      order: [['updated_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'seeker',
          attributes: ['id', 'first_name', 'last_name', 'avatar_url']
        },
        {
          model: User,
          as: 'referrer',
          attributes: ['id', 'first_name', 'last_name', 'avatar_url']
        },
        {
          model: Job,
          attributes: ['id', 'title'],
          include: [{ 
            model: Company,
            attributes: ['id', 'name', 'logo_url']
          }]
        }
      ]
    });

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          total: totalCount,
          pending: pendingCount,
          accepted: acceptedCount,
          rejected: rejectedCount,
          completed: completedCount
        },
        recentActivity
      }
    });
  } catch (error) {
    logger.error('Error getting referral stats:', error);
    next(new AppError('Error getting referral statistics', 500));
  }
}; 