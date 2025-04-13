const express = require('express');
const companyController = require('../controllers/company.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Get all companies with pagination
 *     tags: [Companies]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Company name to search for
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
 *     responses:
 *       200:
 *         description: List of companies
 */
router.get('/', companyController.getCompanies);

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Get a company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company details
 *       404:
 *         description: Company not found
 */
router.get('/:id', companyController.getCompany);

/**
 * @swagger
 * /companies/{id}/jobs:
 *   get:
 *     summary: Get all jobs for a company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID
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
 *     responses:
 *       200:
 *         description: List of jobs for the company
 *       404:
 *         description: Company not found
 */
router.get('/:id/jobs', companyController.getCompanyJobs);

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Create a new company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               logo_url:
 *                 type: string
 *               website:
 *                 type: string
 *               description:
 *                 type: string
 *               industry:
 *                 type: string
 *               size:
 *                 type: string
 *                 enum: [1-10, 11-50, 51-200, 201-500, 501-1000, 1001-5000, 5001-10000, 10001+]
 *               headquarters:
 *                 type: string
 *               founded_year:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Company created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, restrictTo('admin'), companyController.createCompany);

/**
 * @swagger
 * /companies/{id}:
 *   patch:
 *     summary: Update a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               logo_url:
 *                 type: string
 *               website:
 *                 type: string
 *               description:
 *                 type: string
 *               industry:
 *                 type: string
 *               size:
 *                 type: string
 *                 enum: [1-10, 11-50, 51-200, 201-500, 501-1000, 1001-5000, 5001-10000, 10001+]
 *               headquarters:
 *                 type: string
 *               founded_year:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Company not found
 */
router.patch('/:id', protect, restrictTo('admin'), companyController.updateCompany);

/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Delete a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID
 *     responses:
 *       204:
 *         description: Company deleted successfully
 *       400:
 *         description: Cannot delete company with associated jobs
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Company not found
 */
router.delete('/:id', protect, restrictTo('admin'), companyController.deleteCompany);

module.exports = router; 