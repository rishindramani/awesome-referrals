const express = require('express');
const recommendationController = require('../controllers/recommendation.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Recommendations
 *   description: AI-powered recommendation system for jobs and referrers
 */

/**
 * @swagger
 * /recommendations/jobs:
 *   get:
 *     summary: Get personalized job recommendations
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of recommendations to return
 *       - in: query
 *         name: excludeApplied
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Exclude jobs user has already applied to
 *       - in: query
 *         name: includeScore
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include detailed scoring information
 *     responses:
 *       200:
 *         description: Job recommendations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     recommendations:
 *                       type: array
 *                       items:
 *                         type: object
 *                     total:
 *                       type: integer
 *                     algorithm:
 *                       type: string
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.get('/jobs', authMiddleware.protect, recommendationController.getJobRecommendations);

/**
 * @swagger
 * /recommendations/referrers/{jobId}:
 *   get:
 *     summary: Get referrer recommendations for a specific job
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID to find referrers for
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *           default: 5
 *         description: Number of referrer recommendations
 *       - in: query
 *         name: includeScore
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include detailed scoring information
 *     responses:
 *       200:
 *         description: Referrer recommendations retrieved successfully
 *       400:
 *         description: Invalid job ID
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */
router.get('/referrers/:jobId', authMiddleware.protect, recommendationController.getReferrerRecommendations);

/**
 * @swagger
 * /recommendations/trending:
 *   get:
 *     summary: Get trending jobs based on referral activity
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of trending jobs to return
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 30
 *           default: 7
 *         description: Timeframe in days to analyze trends
 *     responses:
 *       200:
 *         description: Trending jobs retrieved successfully
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.get('/trending', authMiddleware.protect, recommendationController.getTrendingJobs);

/**
 * @swagger
 * /recommendations/feed:
 *   get:
 *     summary: Get personalized job feed (recommendations + trending)
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Total number of jobs in feed
 *       - in: query
 *         name: trendingWeight
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *           default: 0.3
 *         description: Weight for trending jobs in feed
 *       - in: query
 *         name: recommendationWeight
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *           default: 0.7
 *         description: Weight for recommended jobs in feed
 *     responses:
 *       200:
 *         description: Personalized feed retrieved successfully
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.get('/feed', authMiddleware.protect, recommendationController.getPersonalizedFeed);

/**
 * @swagger
 * /recommendations/insights:
 *   get:
 *     summary: Get recommendation insights and profile improvement suggestions
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recommendation insights retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     topSkills:
 *                       type: array
 *                       items:
 *                         type: string
 *                     preferredLocations:
 *                       type: array
 *                       items:
 *                         type: string
 *                     averageScore:
 *                       type: number
 *                     improvementSuggestions:
 *                       type: array
 *                       items:
 *                         type: string
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.get('/insights', authMiddleware.protect, recommendationController.getRecommendationInsights);

/**
 * @swagger
 * /recommendations/feedback/{jobId}:
 *   post:
 *     summary: Provide feedback on a job recommendation
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID to provide feedback for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - feedback
 *             properties:
 *               feedback:
 *                 type: string
 *                 enum: [helpful, not_helpful, not_interested, applied]
 *                 description: Feedback on the recommendation
 *               reason:
 *                 type: string
 *                 description: Optional reason for the feedback
 *     responses:
 *       200:
 *         description: Feedback recorded successfully
 *       400:
 *         description: Invalid feedback value
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.post('/feedback/:jobId', authMiddleware.protect, recommendationController.provideFeedback);

module.exports = router;