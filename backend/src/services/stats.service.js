const { Job, User, Company, ReferralRequest } = require('../models');
const { Sequelize, Op } = require('sequelize');

/**
 * Generate date constraints based on period
 * @param {string} period - Time period (week, month, year, all)
 * @returns {Object} Date constraints for Sequelize queries
 */
const getDateConstraints = (period) => {
  const now = new Date();
  let startDate;

  switch (period) {
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default: // 'all' or any other value
      return {}; // No date constraint
  }

  return {
    [Op.between]: [startDate, now]
  };
};

/**
 * Get platform-wide statistics
 * @returns {Object} Platform-wide statistics
 */
exports.getPlatformStats = async () => {
  try {
    const [
      totalUsers,
      totalCompanies,
      totalJobs,
      totalReferrals,
      pendingReferrals,
      acceptedReferrals,
      successfulHires
    ] = await Promise.all([
      User.count(),
      Company.count(),
      Job.count(),
      ReferralRequest.count(),
      ReferralRequest.count({ where: { status: 'pending' } }),
      ReferralRequest.count({ where: { status: 'accepted' } }),
      ReferralRequest.count({ where: { status: 'hired' } })
    ]);

    // Get monthly active users (users who were updated within the last 30 days)
    const activeUsers = await User.count({
      where: {
        updated_at: {
          [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Get referrals created in the current month
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const referralsThisMonth = await ReferralRequest.count({
      where: {
        created_at: {
          [Op.gte]: firstDayOfMonth
        }
      }
    });

    // Get jobs posted this month
    const jobsPostedThisMonth = await Job.count({
      where: {
        created_at: {
          [Op.gte]: firstDayOfMonth
        }
      }
    });

    return {
      totalUsers,
      totalCompanies,
      totalJobs,
      totalReferrals,
      pendingReferrals,
      acceptedReferrals,
      successfulHires,
      activeUsers,
      referralsThisMonth,
      jobsPostedThisMonth
    };
  } catch (error) {
    console.error('Error getting platform stats:', error);
    throw error;
  }
};

/**
 * Get user-specific statistics
 * @param {string} userId - User ID
 * @param {string} period - Time period (week, month, year, all)
 * @returns {Object} User statistics
 */
exports.getUserStats = async (userId, period = 'all') => {
  try {
    const dateConstraint = getDateConstraints(period);
    const whereClause = dateConstraint.hasOwnProperty(Op.between) 
      ? { created_at: dateConstraint } 
      : {};

    // Check if the user is a job seeker or a referrer
    const user = await User.findByPk(userId);
    const isJobSeeker = user.user_type === 'job_seeker';
    
    let referralWhereClause = {
      ...whereClause
    };
    
    if (isJobSeeker) {
      referralWhereClause.seeker_id = userId;
    } else {
      referralWhereClause.referrer_id = userId;
    }

    // Get referral counts by status
    const [
      totalReferralsRequested,
      totalReferralsGiven,
      pendingReferrals,
      acceptedReferrals,
      rejectedReferrals,
      successfulHires
    ] = await Promise.all([
      ReferralRequest.count({ 
        where: { 
          seeker_id: userId,
          ...whereClause
        } 
      }),
      ReferralRequest.count({ 
        where: { 
          referrer_id: userId,
          ...whereClause
        } 
      }),
      ReferralRequest.count({ 
        where: { 
          ...referralWhereClause,
          status: 'pending'
        } 
      }),
      ReferralRequest.count({ 
        where: { 
          ...referralWhereClause,
          status: 'accepted'
        } 
      }),
      ReferralRequest.count({ 
        where: { 
          ...referralWhereClause,
          status: 'rejected'
        } 
      }),
      ReferralRequest.count({ 
        where: { 
          ...referralWhereClause,
          status: 'hired'
        } 
      })
    ]);

    // Calculate response rate (for referrers)
    let responseRate = 0;
    if (!isJobSeeker && totalReferralsGiven > 0) {
      const respondedReferrals = acceptedReferrals + rejectedReferrals;
      responseRate = Math.round((respondedReferrals / totalReferralsGiven) * 100);
    }

    // Get saved jobs count
    const savedJobs = await user.countSavedJobs();

    return {
      totalReferralsRequested,
      totalReferralsGiven,
      pendingReferrals,
      acceptedReferrals,
      rejectedReferrals,
      successfulHires,
      responseRate,
      savedJobs
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
};

/**
 * Get referral statistics
 * @param {string} period - Time period (week, month, year, all)
 * @returns {Object} Referral statistics
 */
exports.getReferralStats = async (period = 'all') => {
  try {
    const dateConstraint = getDateConstraints(period);
    const whereClause = dateConstraint.hasOwnProperty(Op.between) 
      ? { created_at: dateConstraint } 
      : {};

    // Get referrals by status
    const statuses = ['pending', 'accepted', 'rejected', 'hired'];
    const statusCounts = await Promise.all(
      statuses.map(status => 
        ReferralRequest.count({ 
          where: { 
            ...whereClause,
            status 
          } 
        })
      )
    );

    const byStatus = statuses.map((status, index) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusCounts[index]
    }));

    // Get referrals by company
    const referralsByCompany = await ReferralRequest.findAll({
      attributes: [
        [Sequelize.literal('"job->company"."name"'), 'name'],
        [Sequelize.fn('COUNT', Sequelize.col('ReferralRequest.id')), 'value']
      ],
      include: [
        {
          model: Job,
          as: 'job',
          attributes: [],
          include: [
            {
              model: Company,
              as: 'company',
              attributes: []
            }
          ]
        }
      ],
      where: whereClause,
      group: [Sequelize.literal('"job->company"."name"')],
      order: [[Sequelize.literal('value'), 'DESC']],
      limit: 10,
      raw: true
    });

    // Get referrals over time (last 6 months)
    const months = [];
    const referralCounts = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const count = await ReferralRequest.count({
        where: {
          created_at: {
            [Op.between]: [startOfMonth, endOfMonth]
          }
        }
      });
      
      months.push(`${month} ${year}`);
      referralCounts.push(count);
    }

    const byTime = months.map((name, index) => ({
      name,
      value: referralCounts[index]
    }));

    // Calculate success rate
    const totalReferrals = await ReferralRequest.count(whereClause);
    const successfulReferrals = await ReferralRequest.count({
      where: {
        ...whereClause,
        status: 'hired'
      }
    });
    
    const successRate = totalReferrals > 0 
      ? Math.round((successfulReferrals / totalReferrals) * 100) 
      : 0;

    return {
      byStatus,
      byCompany: referralsByCompany,
      byTime,
      successRate
    };
  } catch (error) {
    console.error('Error getting referral stats:', error);
    throw error;
  }
};

/**
 * Get job statistics
 * @param {string} period - Time period (week, month, year, all)
 * @returns {Object} Job statistics
 */
exports.getJobStats = async (period = 'all') => {
  try {
    const dateConstraint = getDateConstraints(period);
    const whereClause = dateConstraint.hasOwnProperty(Op.between) 
      ? { created_at: dateConstraint } 
      : {};

    // Get jobs by type
    const jobsByType = await Job.findAll({
      attributes: [
        'job_type',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'value']
      ],
      where: whereClause,
      group: ['job_type'],
      order: [[Sequelize.literal('value'), 'DESC']],
      limit: 10,
      raw: true
    });

    const byType = jobsByType.map(job => ({
      name: job.job_type || 'Unknown',
      value: parseInt(job.value)
    }));

    // Get jobs by location
    const jobsByLocation = await Job.findAll({
      attributes: [
        'location',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'value']
      ],
      where: whereClause,
      group: ['location'],
      order: [[Sequelize.literal('value'), 'DESC']],
      limit: 10,
      raw: true
    });

    const byLocation = jobsByLocation.map(job => ({
      name: job.location,
      value: parseInt(job.value)
    }));

    // Get jobs by company
    const jobsByCompany = await Job.findAll({
      attributes: [
        [Sequelize.literal('"company"."name"'), 'name'],
        [Sequelize.fn('COUNT', Sequelize.col('Job.id')), 'value']
      ],
      include: [
        {
          model: Company,
          as: 'company',
          attributes: []
        }
      ],
      where: whereClause,
      group: [Sequelize.literal('"company"."name"')],
      order: [[Sequelize.literal('value'), 'DESC']],
      limit: 10,
      raw: true
    });

    // Get most requested jobs - simplified for empty database
    let mostRequestedJobs = [];
    try {
      const mostRequested = await Job.findAll({
        attributes: [
          'title',
          [Sequelize.fn('COUNT', Sequelize.col('referralRequests.id')), 'value']
        ],
        include: [
          {
            model: ReferralRequest,
            as: 'referralRequests',
            attributes: [],
            required: true, // Inner join to only get jobs with referrals
            where: dateConstraint.hasOwnProperty(Op.between) 
              ? { created_at: dateConstraint } 
              : {}
          }
        ],
        group: ['Job.id', 'Job.title'],
        order: [[Sequelize.literal('value'), 'DESC']],
        limit: 10,
        raw: true
      });

      mostRequestedJobs = mostRequested.map(job => ({
        name: job.title,
        value: parseInt(job.value)
      }));
    } catch (error) {
      console.log('No referral requests found for jobs');
      mostRequestedJobs = [];
    }

    return {
      byType,
      byLocation,
      byCompany: jobsByCompany,
      mostRequested: mostRequestedJobs
    };
  } catch (error) {
    console.error('Error getting job stats:', error);
    throw error;
  }
};

/**
 * Get dashboard statistics (all stats in one call)
 * @param {string} userId - User ID
 * @param {string} period - Time period (week, month, year, all)
 * @returns {Object} Dashboard statistics
 */
exports.getDashboardStats = async (userId, period = 'all') => {
  try {
    const [platformStats, userStats, referralStats, jobStats] = await Promise.all([
      this.getPlatformStats(),
      this.getUserStats(userId, period),
      this.getReferralStats(period),
      this.getJobStats(period)
    ]);

    return {
      platformStats,
      userStats,
      referralStats,
      jobStats
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
}; 