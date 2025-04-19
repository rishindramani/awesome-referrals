const jobApiService = require('../services/jobApi.service');
const { catchAsync } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Search for jobs from Naukri.com
 * @route GET /api/external-jobs/naukri
 */
const searchNaukriJobs = catchAsync(async (req, res) => {
  const { keyword, page = 1, limit = 10, location, experience } = req.query;
  
  const jobs = await jobApiService.fetchJobsFromNaukri({
    keyword,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    location,
    experience
  });
  
  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs
  });
});

/**
 * Search for jobs from LinkedIn
 * @route GET /api/external-jobs/linkedin
 */
const searchLinkedInJobs = catchAsync(async (req, res) => {
  const { keyword, page = 1, limit = 10, location } = req.query;
  
  const jobs = await jobApiService.fetchJobsFromLinkedIn({
    keyword,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    location
  });
  
  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs
  });
});

/**
 * Import a job from an external source to our database
 * @route POST /api/external-jobs/import
 */
const importExternalJob = catchAsync(async (req, res) => {
  const { job, source } = req.body;
  
  if (!job || !source) {
    return res.status(400).json({
      success: false,
      message: 'Job data and source are required'
    });
  }
  
  // Validate source
  if (!['naukri', 'linkedin'].includes(source)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid source. Must be one of: naukri, linkedin'
    });
  }
  
  const importedJob = await jobApiService.importJobToDatabase(job, source);
  
  res.status(201).json({
    success: true,
    data: importedJob
  });
});

/**
 * Search for jobs from all integrated external sources
 * @route GET /api/external-jobs/search
 */
const searchAllExternalJobs = catchAsync(async (req, res) => {
  const { keyword, page = 1, limit = 10, location, sources = 'naukri,linkedin' } = req.query;
  
  const sourcesArray = sources.split(',');
  let allJobs = [];
  
  // Concurrent requests to all enabled sources
  const requests = [];
  
  if (sourcesArray.includes('naukri')) {
    requests.push(
      jobApiService.fetchJobsFromNaukri({
        keyword,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        location
      })
    );
  }
  
  if (sourcesArray.includes('linkedin')) {
    requests.push(
      jobApiService.fetchJobsFromLinkedIn({
        keyword,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        location
      })
    );
  }
  
  try {
    const results = await Promise.allSettled(requests);
    
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        allJobs = [...allJobs, ...result.value];
      } else {
        logger.error('Failed to fetch from an external source:', result.reason);
      }
    });
    
    // Sort all jobs by posted date (most recent first)
    allJobs.sort((a, b) => new Date(b.posted_at) - new Date(a.posted_at));
    
    // Apply pagination to combined results
    const startIndex = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const endIndex = startIndex + parseInt(limit, 10);
    const paginatedJobs = allJobs.slice(startIndex, endIndex);
    
    res.status(200).json({
      success: true,
      count: paginatedJobs.length,
      total: allJobs.length,
      data: paginatedJobs
    });
  } catch (error) {
    logger.error('Error in searchAllExternalJobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search external jobs'
    });
  }
});

module.exports = {
  searchNaukriJobs,
  searchLinkedInJobs,
  importExternalJob,
  searchAllExternalJobs
}; 