const express = require('express');
const referralController = require('../controllers/referral.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Referrals
 *   description: API for managing referral requests
 */

/**
 * @swagger
 * /referrals:
 *   get:
 *     summary: Get all referral requests for the current user
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, accepted, rejected, completed]
 *         description: Filter referrals by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of referral requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     referralRequests:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ReferralRequest'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware.protect, referralController.getReferralRequests);

/**
 * @swagger
 * /referrals/stats:
 *   get:
 *     summary: Get statistics about referral requests
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referral request statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         pending:
 *                           type: integer
 *                         accepted:
 *                           type: integer
 *                         rejected:
 *                           type: integer
 *                         completed:
 *                           type: integer
 *                     recentActivity:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ReferralRequest'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.get('/stats', authMiddleware.protect, referralController.getReferralStats);

/**
 * @swagger
 * /referrals/{id}:
 *   get:
 *     summary: Get a single referral request by ID
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Referral request ID
 *     responses:
 *       200:
 *         description: Referral request found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     referralRequest:
 *                       $ref: '#/components/schemas/ReferralRequest'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to view this referral request
 *       404:
 *         description: Referral request not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authMiddleware.protect, referralController.getReferralRequest);

/**
 * @swagger
 * /referrals:
 *   post:
 *     summary: Create a new referral request
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - job_id
 *               - referrer_id
 *             properties:
 *               job_id:
 *                 type: integer
 *                 description: ID of the job to request referral for
 *               referrer_id:
 *                 type: integer
 *                 description: ID of the user to request referral from
 *               message:
 *                 type: string
 *                 description: Message to the referrer
 *               resume_url:
 *                 type: string
 *                 description: URL to the seeker's resume
 *     responses:
 *       201:
 *         description: Referral request created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     referralRequest:
 *                       $ref: '#/components/schemas/ReferralRequest'
 *       400:
 *         description: Invalid input or duplicate request
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Job or referrer not found
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware.protect, authMiddleware.restrictTo('seeker'), referralController.createReferralRequest);

/**
 * @swagger
 * /referrals/{id}:
 *   patch:
 *     summary: Update a referral request
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Referral request ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, rejected, completed]
 *                 description: New status (referrer only)
 *               feedback:
 *                 type: string
 *                 description: Feedback from referrer (referrer only)
 *               message:
 *                 type: string
 *                 description: Updated message (seeker only, if pending)
 *               resume_url:
 *                 type: string
 *                 description: Updated resume URL (seeker only, if pending)
 *     responses:
 *       200:
 *         description: Referral request updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     referralRequest:
 *                       $ref: '#/components/schemas/ReferralRequest'
 *       400:
 *         description: Invalid input or cannot update non-pending request
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to update this referral request
 *       404:
 *         description: Referral request not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', authMiddleware.protect, referralController.updateReferralRequest);

/**
 * @swagger
 * /referrals/{id}:
 *   delete:
 *     summary: Delete a referral request
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Referral request ID
 *     responses:
 *       204:
 *         description: Referral request deleted
 *       400:
 *         description: Cannot delete non-pending request
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to delete this referral request
 *       404:
 *         description: Referral request not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware.protect, referralController.deleteReferralRequest);

/**
 * @swagger
 * components:
 *   schemas:
 *     ReferralRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         job_id:
 *           type: integer
 *         seeker_id:
 *           type: integer
 *         referrer_id:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected, completed]
 *         message:
 *           type: string
 *         feedback:
 *           type: string
 *         resume_url:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         accepted_at:
 *           type: string
 *           format: date-time
 *         rejected_at:
 *           type: string
 *           format: date-time
 *         completed_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         seeker:
 *           $ref: '#/components/schemas/UserSummary'
 *         referrer:
 *           $ref: '#/components/schemas/UserSummary'
 *         job:
 *           $ref: '#/components/schemas/Job'
 *     UserSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *         avatar_url:
 *           type: string
 */

module.exports = router; 