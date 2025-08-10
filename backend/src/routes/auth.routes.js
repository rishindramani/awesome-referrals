const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const Joi = require('joi');

const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  })
};

const registerSchema = {
  body: Joi.object({
    firstName: Joi.string().min(1).max(100).required(),
    lastName: Joi.string().min(1).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    userType: Joi.string().valid('job_seeker', 'referrer').default('job_seeker')
  })
};

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               userType:
 *                 type: string
 *                 enum: [job_seeker, referrer, admin]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user info
 *       401:
 *         description: Unauthorized
 */
router.get('/me', protect, authController.getCurrentUser);

/**
 * @swagger
 * /auth/updatepassword:
 *   patch:
 *     summary: Update user password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       401:
 *         description: Unauthorized
 */
router.patch('/updatepassword', protect, authController.updatePassword);

/**
 * @swagger
 * /auth/forgotpassword:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset instructions sent
 *       404:
 *         description: User not found
 */
router.post('/forgotpassword', authController.forgotPassword);

/**
 * @swagger
 * /auth/linkedin:
 *   get:
 *     summary: Initiate LinkedIn authentication
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to LinkedIn
 */
router.get('/linkedin', (req, res) => {
  // In a real application, you would redirect to LinkedIn OAuth
  res.redirect(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${config.linkedin.clientId}&redirect_uri=${config.linkedin.callbackUrl}&state=random_state&scope=r_liteprofile%20r_emailaddress`);
});

/**
 * @swagger
 * /auth/linkedin/callback:
 *   get:
 *     summary: LinkedIn authentication callback
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: LinkedIn authorization code
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         required: true
 *         description: State parameter for security
 *     responses:
 *       200:
 *         description: Authentication successful
 *       401:
 *         description: Authentication failed
 */
router.get('/linkedin/callback', authController.linkedinCallback);

module.exports = router; 