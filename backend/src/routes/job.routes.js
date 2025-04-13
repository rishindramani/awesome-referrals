const express = require('express');
const jobController = require('../controllers/job.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs with filtering and pagination
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Job title to search for
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         description: Company name to filter by
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Job location to filter by
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [full-time, part-time, contract, internship]
 *         description: Job type
 *       - in: query
 *         name: experience_level
 *         schema:
 *           type: string
 *           enum: [entry, mid, senior, executive]
 *         description: Experience level required
 *       - in: query
 *         name: salary_min
 *         schema:
 *           type: number
 *         description: Minimum salary
 *       - in: query
 *         name: salary_max
 *         schema:
 *           type: number
 *         description: Maximum salary
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         description: Comma-separated list of skills
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           default: created_at
 *         description: Field to sort by
 *       - in: query
 *         name: sort_dir
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: List of jobs
 */
router.get('/', jobController.getJobs);

/**
 * @swagger
 * /jobs/trending:
 *   get:
 *     summary: Get trending or recommended jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of trending jobs
 */
router.get('/trending', jobController.getTrendingJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get a job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 */
router.get('/:id', jobController.getJob);

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - company_id
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               company_id:
 *                 type: integer
 *               location:
 *                 type: string
 *               is_remote:
 *                 type: boolean
 *               job_type:
 *                 type: string
 *                 enum: [full-time, part-time, contract, internship]
 *               experience_level:
 *                 type: string
 *                 enum: [entry, mid, senior, executive]
 *               salary_min:
 *                 type: number
 *               salary_max:
 *                 type: number
 *               responsibilities:
 *                 type: string
 *               requirements:
 *                 type: string
 *               benefits:
 *                 type: string
 *               application_url:
 *                 type: string
 *               expiry_date:
 *                 type: string
 *                 format: date
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Job created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, restrictTo('admin', 'referrer'), jobController.createJob);

/**
 * @swagger
 * /jobs/{id}:
 *   patch:
 *     summary: Update a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               is_remote:
 *                 type: boolean
 *               job_type:
 *                 type: string
 *                 enum: [full-time, part-time, contract, internship]
 *               experience_level:
 *                 type: string
 *                 enum: [entry, mid, senior, executive]
 *               salary_min:
 *                 type: number
 *               salary_max:
 *                 type: number
 *               responsibilities:
 *                 type: string
 *               requirements:
 *                 type: string
 *               benefits:
 *                 type: string
 *               application_url:
 *                 type: string
 *               expiry_date:
 *                 type: string
 *                 format: date
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Job not found
 */
router.patch('/:id', protect, jobController.updateJob);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Delete a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     responses:
 *       204:
 *         description: Job deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Job not found
 */
router.delete('/:id', protect, jobController.deleteJob);

module.exports = router; 