const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const externalJobController = require('../controllers/externalJob.controller');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Search jobs from external sources
router.get('/search', externalJobController.searchAllExternalJobs);

// Source-specific routes
router.get('/naukri', externalJobController.searchNaukriJobs);
router.get('/linkedin', externalJobController.searchLinkedInJobs);

// Import external job to our database
router.post('/import', externalJobController.importExternalJob);

module.exports = router; 