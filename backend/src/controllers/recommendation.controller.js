const RecommendationService = require('../services/recommendation.service');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
const catchAsync = require('../utils/catchAsync');

/**
 * Get job recommendations for the current user
 */
exports.getJobRecommendations = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { 
    limit = 10, 
    excludeApplied = 'true',
    includeScore = 'false' 
  } = req.query;

  const options = {
    limit: parseInt(limit),
    excludeApplied: excludeApplied === 'true'
  };

  const recommendations = await RecommendationService.getJobRecommendations(userId, options);

  // Remove score details if not requested (for privacy)
  const responseData = includeScore === 'true' 
    ? recommendations 
    : recommendations.map(job => {
        const { recommendationScore, recommendationFactors, ...jobData } = job;
        return { ...jobData, matchScore: Math.round(recommendationScore) };
      });

  logger.info(`Retrieved ${recommendations.length} job recommendations for user ${userId}`);

  res.status(200).json({
    success: true,
    data: {
      recommendations: responseData,
      total: recommendations.length,
      algorithm: 'skill-location-experience-based'
    }
  });
});

/**
 * Get referrer recommendations for a specific job
 */
exports.getReferrerRecommendations = catchAsync(async (req, res) => {
  const seekerId = req.user.id;
  const { jobId } = req.params;
  const { limit = 5, includeScore = 'false' } = req.query;

  if (!jobId) {
    throw new AppError('Job ID is required', 400);
  }

  const options = {
    limit: parseInt(limit)
  };

  const recommendations = await RecommendationService.getReferrerRecommendations(
    parseInt(jobId), 
    seekerId, 
    options
  );

  // Remove score details if not requested (for privacy)
  const responseData = includeScore === 'true' 
    ? recommendations 
    : recommendations.map(referrer => {
        const { recommendationScore, recommendationFactors, ...referrerData } = referrer;
        return { ...referrerData, matchScore: Math.round(recommendationScore) };
      });

  logger.info(`Retrieved ${recommendations.length} referrer recommendations for job ${jobId}`);

  res.status(200).json({
    success: true,
    data: {
      recommendations: responseData,
      total: recommendations.length,
      jobId: parseInt(jobId),
      algorithm: 'company-skill-seniority-based'
    }
  });
});

/**
 * Get trending jobs based on recent referral activity
 */
exports.getTrendingJobs = catchAsync(async (req, res) => {
  const { 
    limit = 10, 
    timeframe = 7 // days
  } = req.query;

  const options = {
    limit: parseInt(limit),
    timeframe: parseInt(timeframe)
  };

  const trendingJobs = await RecommendationService.getTrendingJobs(options);

  logger.info(`Retrieved ${trendingJobs.length} trending jobs`);

  res.status(200).json({
    success: true,
    data: {
      trendingJobs: trendingJobs.map(job => ({
        ...job.toJSON(),
        trendingScore: job.dataValues.referral_count
      })),
      total: trendingJobs.length,
      timeframe: `${timeframe} days`,
      algorithm: 'referral-activity-based'
    }
  });
});

/**
 * Get personalized job feed (combines recommendations with trending)
 */
exports.getPersonalizedFeed = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { 
    limit = 20,
    trendingWeight = 0.3,
    recommendationWeight = 0.7
  } = req.query;

  const recommendationLimit = Math.floor(limit * parseFloat(recommendationWeight));
  const trendingLimit = Math.floor(limit * parseFloat(trendingWeight));

  // Get both recommendations and trending jobs
  const [recommendations, trending] = await Promise.all([
    RecommendationService.getJobRecommendations(userId, { 
      limit: recommendationLimit,
      excludeApplied: true 
    }),
    RecommendationService.getTrendingJobs({ 
      limit: trendingLimit,
      timeframe: 7 
    })
  ]);

  // Combine and interleave the results
  const personalizedFeed = [];
  const maxLength = Math.max(recommendations.length, trending.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < recommendations.length) {
      personalizedFeed.push({
        ...recommendations[i],
        feedType: 'recommended',
        feedReason: 'Based on your profile and activity'
      });
    }
    if (i < trending.length) {
      // Avoid duplicates
      const isDuplicate = personalizedFeed.some(item => 
        item.id === trending[i].id
      );
      if (!isDuplicate) {
        personalizedFeed.push({
          ...trending[i].toJSON(),
          feedType: 'trending',
          feedReason: 'Popular among job seekers',
          trendingScore: trending[i].dataValues.referral_count
        });
      }
    }
  }

  logger.info(`Generated personalized feed with ${personalizedFeed.length} jobs for user ${userId}`);

  res.status(200).json({
    success: true,
    data: {
      feed: personalizedFeed.slice(0, limit),
      total: personalizedFeed.length,
      composition: {
        recommended: recommendations.length,
        trending: trending.filter(t => !recommendations.some(r => r.id === t.id)).length
      },
      algorithm: 'hybrid-recommendation-trending'
    }
  });
});

/**
 * Get recommendation insights for the user
 */
exports.getRecommendationInsights = catchAsync(async (req, res) => {
  const userId = req.user.id;
  
  // Get sample recommendations with full scoring details
  const recommendations = await RecommendationService.getJobRecommendations(userId, { 
    limit: 5,
    excludeApplied: true 
  });

  // Analyze recommendation factors
  const insights = {
    topSkills: [],
    preferredLocations: [],
    averageScore: 0,
    improvementSuggestions: []
  };

  if (recommendations.length > 0) {
    // Calculate average score
    insights.averageScore = recommendations.reduce(
      (sum, rec) => sum + rec.recommendationScore, 0
    ) / recommendations.length;

    // Extract most common factors
    const skillFactors = [];
    const locationFactors = [];

    recommendations.forEach(rec => {
      rec.recommendationFactors.forEach(factor => {
        if (factor.type === 'skills' && factor.details) {
          skillFactors.push(...factor.details);
        }
        if (factor.type === 'location' && factor.details) {
          locationFactors.push(factor.details);
        }
      });
    });

    // Get top skills
    const skillCounts = {};
    skillFactors.forEach(skill => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
    insights.topSkills = Object.entries(skillCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([skill]) => skill);

    // Get preferred locations
    insights.preferredLocations = [...new Set(locationFactors)];

    // Generate improvement suggestions
    if (insights.averageScore < 30) {
      insights.improvementSuggestions.push('Complete your profile with more skills and experience details');
    }
    if (insights.topSkills.length < 3) {
      insights.improvementSuggestions.push('Add more relevant skills to your profile');
    }
    if (insights.preferredLocations.length === 0) {
      insights.improvementSuggestions.push('Specify your preferred work locations');
    }
  }

  logger.info(`Generated recommendation insights for user ${userId}`);

  res.status(200).json({
    success: true,
    data: insights
  });
});

/**
 * Provide feedback on a recommendation
 */
exports.provideFeedback = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { jobId } = req.params;
  const { feedback, reason } = req.body;

  // Validate feedback
  const validFeedback = ['helpful', 'not_helpful', 'not_interested', 'applied'];
  if (!validFeedback.includes(feedback)) {
    throw new AppError('Invalid feedback value', 400);
  }

  // In a real implementation, we would store this feedback to improve the algorithm
  // For now, we'll just log it
  logger.info(`User ${userId} provided feedback "${feedback}" for job ${jobId}: ${reason || 'No reason provided'}`);

  res.status(200).json({
    success: true,
    message: 'Feedback recorded successfully',
    data: {
      jobId: parseInt(jobId),
      feedback,
      reason: reason || null
    }
  });
});