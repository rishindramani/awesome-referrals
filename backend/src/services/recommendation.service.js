const { Job, User, Company, ReferralRequest, UserProfile, SavedJob } = require('../models');
const { Op, Sequelize } = require('sequelize');
const logger = require('../utils/logger');

/**
 * Recommendation Service
 * Provides job and user recommendations based on various algorithms
 */
class RecommendationService {
  
  /**
   * Get job recommendations for a user
   * @param {number} userId - User ID
   * @param {Object} options - Recommendation options
   * @returns {Promise<Array>} - Array of recommended jobs
   */
  static async getJobRecommendations(userId, options = {}) {
    try {
      const { limit = 10, excludeApplied = true } = options;
      
      // Get user profile and activity data
      const user = await User.findByPk(userId, {
        include: [
          {
            model: UserProfile,
            as: 'profile'
          },
          {
            model: Job,
            as: 'savedJobs',
            attributes: ['id'],
            through: { attributes: [] } // Exclude junction table data
          }
        ]
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Get user's referral history for skill extraction
      const userReferrals = await ReferralRequest.findAll({
        where: { seeker_id: userId },
        include: [{
          model: Job,
          as: 'job',
          include: [{ model: Company, as: 'company' }]
        }]
      });

      // Extract user preferences and skills
      const userSkills = this.extractUserSkills(user, userReferrals);
      const preferredLocations = this.extractPreferredLocations(user, userReferrals);
      const preferredCompanies = this.extractPreferredCompanies(userReferrals);

      // Build recommendation query
      const whereConditions = {
        // Only include jobs that have the required fields
        title: { [Op.ne]: null },
        description: { [Op.ne]: null }
      };

      // Exclude jobs user has already applied to or saved
      if (excludeApplied) {
        const appliedJobIds = userReferrals.map(r => r.job_id);
        const savedJobIds = user.savedJobs.map(j => j.id);
        const excludeIds = [...appliedJobIds, ...savedJobIds];
        
        if (excludeIds.length > 0) {
          whereConditions.id = { [Op.notIn]: excludeIds };
        }
      }

      // Get potential job matches
      const jobs = await Job.findAll({
        where: whereConditions,
        include: [
          {
            model: Company,
            as: 'company',
            attributes: ['id', 'name', 'industry', 'logo_url', 'website']
          }
        ],
        limit: limit * 3, // Get more jobs for scoring
        order: [['created_at', 'DESC']]
      });

      // Score and rank jobs
      const scoredJobs = await this.scoreJobs(jobs, {
        userSkills,
        preferredLocations,
        preferredCompanies,
        userProfile: user.profile
      });

      // Return top recommendations
      return scoredJobs.slice(0, limit);
    } catch (error) {
      logger.error('Error getting job recommendations:', error);
      throw error;
    }
  }

  /**
   * Get referrer recommendations for a job
   * @param {number} jobId - Job ID
   * @param {number} seekerId - Job seeker ID
   * @param {Object} options - Recommendation options
   * @returns {Promise<Array>} - Array of recommended referrers
   */
  static async getReferrerRecommendations(jobId, seekerId, options = {}) {
    try {
      const { limit = 5 } = options;

      // Get job details
      const job = await Job.findByPk(jobId, {
        include: [{ model: Company, as: 'company' }]
      });

      if (!job) {
        throw new Error('Job not found');
      }

      // Find potential referrers
      const potentialReferrers = await User.findAll({
        where: {
          user_type: { [Op.in]: ['referrer'] }, // Only referrer type exists in our model
          id: { [Op.ne]: seekerId }
        },
        include: [
          {
            model: UserProfile,
            as: 'profile',
            required: false // Left join to get users even without complete profiles
          }
        ]
      });

      // Score referrers based on various factors
      const scoredReferrers = await this.scoreReferrers(potentialReferrers, job, seekerId);

      return scoredReferrers.slice(0, limit);
    } catch (error) {
      logger.error('Error getting referrer recommendations:', error);
      throw error;
    }
  }

  /**
   * Get trending jobs based on referral activity
   * @param {Object} options - Options
   * @returns {Promise<Array>} - Array of trending jobs
   */
  static async getTrendingJobs(options = {}) {
    try {
      const { limit = 10, timeframe = 7 } = options; // days
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeframe);

      // Simplified query - just return recent jobs for now
      // In a production environment with data, this would include referral counting
      const trendingJobs = await Job.findAll({
        include: [
          {
            model: Company,
            as: 'company',
            attributes: ['id', 'name', 'industry', 'logo_url']
          }
        ],
        attributes: [
          'id',
          'title',
          'description',
          'location',
          'job_type',
          'experience_level'
        ],
        order: [['created_at', 'DESC']],
        limit
      });

      // Add mock referral count for demonstration
      const trendingJobsWithCount = trendingJobs.map((job, index) => {
        const jobData = job.toJSON();
        jobData.dataValues = { referral_count: Math.max(1, 5 - index) };
        return {
          ...jobData,
          toJSON: () => jobData
        };
      });

      return trendingJobsWithCount;
    } catch (error) {
      logger.error('Error getting trending jobs:', error);
      throw error;
    }
  }

  /**
   * Extract user skills from profile and activity
   */
  static extractUserSkills(user, referrals) {
    const skills = new Set();
    
    // From user profile
    if (user.profile?.skills) {
      const profileSkills = Array.isArray(user.profile.skills) 
        ? user.profile.skills 
        : user.profile.skills.split(',');
      profileSkills.forEach(skill => skills.add(skill.trim().toLowerCase()));
    }

    // From job history
    referrals.forEach(referral => {
      if (referral.job?.skills) {
        const jobSkills = Array.isArray(referral.job.skills)
          ? referral.job.skills
          : referral.job.skills.split(',');
        jobSkills.forEach(skill => skills.add(skill.trim().toLowerCase()));
      }
    });

    return Array.from(skills);
  }

  /**
   * Extract preferred locations from user activity
   */
  static extractPreferredLocations(user, referrals) {
    const locations = new Set();
    
    // From user profile
    if (user.profile?.location) {
      locations.add(user.profile.location.toLowerCase());
    }

    // From job application history
    referrals.forEach(referral => {
      if (referral.job?.location) {
        locations.add(referral.job.location.toLowerCase());
      }
    });

    return Array.from(locations);
  }

  /**
   * Extract preferred companies from referral history
   */
  static extractPreferredCompanies(referrals) {
    const companies = new Set();
    
    referrals.forEach(referral => {
      if (referral.job?.company?.name) {
        companies.add(referral.job.company.name.toLowerCase());
      }
    });

    return Array.from(companies);
  }

  /**
   * Score jobs based on user preferences and profile
   */
  static async scoreJobs(jobs, userContext) {
    const { userSkills, preferredLocations, preferredCompanies, userProfile } = userContext;
    
    return jobs.map(job => {
      let score = 0;
      const factors = [];

      // Skill matching (40% weight)
      if (job.skills && userSkills.length > 0) {
        const jobSkills = Array.isArray(job.skills) 
          ? job.skills 
          : job.skills.split(',').map(s => s.trim().toLowerCase());
        
        const matchingSkills = jobSkills.filter(skill => 
          userSkills.some(userSkill => 
            skill.includes(userSkill) || userSkill.includes(skill)
          )
        );
        
        const skillScore = (matchingSkills.length / Math.max(jobSkills.length, userSkills.length)) * 40;
        score += skillScore;
        factors.push({ type: 'skills', score: skillScore, details: matchingSkills });
      }

      // Location matching (20% weight)
      if (job.location && preferredLocations.length > 0) {
        const locationMatch = preferredLocations.some(loc => 
          job.location.toLowerCase().includes(loc) || loc.includes(job.location.toLowerCase())
        );
        if (locationMatch) {
          score += 20;
          factors.push({ type: 'location', score: 20, details: job.location });
        }
      }

      // Experience level matching (15% weight)
      if (job.experience_level && userProfile?.experience_years) {
        const experienceScore = this.calculateExperienceScore(
          job.experience_level, 
          userProfile.experience_years
        );
        score += experienceScore * 15;
        factors.push({ type: 'experience', score: experienceScore * 15, details: job.experience_level });
      }

      // Company preference (10% weight)
      if (job.company && preferredCompanies.length > 0) {
        const companyMatch = preferredCompanies.some(company => 
          job.company.name.toLowerCase().includes(company)
        );
        if (companyMatch) {
          score += 10;
          factors.push({ type: 'company', score: 10, details: job.company.name });
        }
      }

      // Job type preference (10% weight)
      if (job.job_type && userProfile?.preferred_job_type) {
        if (job.job_type.toLowerCase() === userProfile.preferred_job_type.toLowerCase()) {
          score += 10;
          factors.push({ type: 'job_type', score: 10, details: job.job_type });
        }
      }

      // Recency bonus (5% weight)
      const daysSincePosted = Math.floor((new Date() - new Date(job.created_at)) / (1000 * 60 * 60 * 24));
      const recencyScore = Math.max(0, 5 - (daysSincePosted * 0.1));
      score += recencyScore;
      factors.push({ type: 'recency', score: recencyScore, details: `${daysSincePosted} days old` });

      return {
        ...job.toJSON(),
        recommendationScore: Math.round(score * 100) / 100,
        recommendationFactors: factors
      };
    }).sort((a, b) => b.recommendationScore - a.recommendationScore);
  }

  /**
   * Score referrers based on various factors
   */
  static async scoreReferrers(referrers, job, seekerId) {
    return referrers.map(referrer => {
      let score = 0;
      const factors = [];

      // Company match (50% weight)
      if (referrer.profile?.current_company === job.company.name) {
        score += 50;
        factors.push({ type: 'current_company', score: 50, details: 'Works at target company' });
      } else if (referrer.profile?.previous_companies?.includes(job.company.name)) {
        score += 30;
        factors.push({ type: 'previous_company', score: 30, details: 'Previously worked at company' });
      }

      // Skill relevance (25% weight)
      if (referrer.profile?.skills && job.skills) {
        const referrerSkills = Array.isArray(referrer.profile.skills)
          ? referrer.profile.skills
          : referrer.profile.skills.split(',').map(s => s.trim().toLowerCase());
        
        const jobSkills = Array.isArray(job.skills)
          ? job.skills
          : job.skills.split(',').map(s => s.trim().toLowerCase());

        const matchingSkills = referrerSkills.filter(skill =>
          jobSkills.some(jobSkill => skill.includes(jobSkill) || jobSkill.includes(skill))
        );

        const skillScore = (matchingSkills.length / jobSkills.length) * 25;
        score += skillScore;
        factors.push({ type: 'skills', score: skillScore, details: matchingSkills });
      }

      // Seniority level (15% weight)
      if (referrer.profile?.seniority_level) {
        const seniorityScore = this.calculateSeniorityScore(referrer.profile.seniority_level);
        score += seniorityScore * 15;
        factors.push({ type: 'seniority', score: seniorityScore * 15, details: referrer.profile.seniority_level });
      }

      // Response rate (10% weight) - would need historical data
      // For now, give a base score
      score += 5;
      factors.push({ type: 'responsiveness', score: 5, details: 'Active user' });

      return {
        ...referrer.toJSON(),
        recommendationScore: Math.round(score * 100) / 100,
        recommendationFactors: factors
      };
    }).sort((a, b) => b.recommendationScore - a.recommendationScore);
  }

  /**
   * Calculate experience score based on job requirements vs user experience
   */
  static calculateExperienceScore(jobLevel, userYears) {
    const levelRanges = {
      'entry': [0, 2],
      'junior': [1, 3], 
      'mid': [3, 6],
      'senior': [5, 10],
      'lead': [8, 15],
      'principal': [10, 20]
    };

    const range = levelRanges[jobLevel.toLowerCase()];
    if (!range) return 0.5; // Default score for unknown levels

    const [min, max] = range;
    if (userYears >= min && userYears <= max) {
      return 1; // Perfect match
    } else if (userYears < min) {
      return Math.max(0, 1 - (min - userYears) * 0.2); // Penalty for being under-qualified
    } else {
      return Math.max(0.3, 1 - (userYears - max) * 0.1); // Smaller penalty for being over-qualified
    }
  }

  /**
   * Calculate seniority score
   */
  static calculateSeniorityScore(seniorityLevel) {
    const scores = {
      'intern': 0.2,
      'junior': 0.4,
      'mid': 0.6,
      'senior': 0.8,
      'lead': 0.9,
      'principal': 1,
      'director': 1,
      'vp': 1
    };

    return scores[seniorityLevel.toLowerCase()] || 0.5;
  }
}

module.exports = RecommendationService;