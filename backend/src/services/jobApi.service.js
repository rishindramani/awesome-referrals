const axios = require('axios');
const config = require('../config');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Service for fetching jobs from external APIs like Naukri.com and LinkedIn
 */
class JobApiService {
  /**
   * Fetch jobs from Naukri.com API
   * @param {Object} params - Search parameters
   * @param {string} params.keyword - Search keyword
   * @param {number} params.page - Page number (starts from 1)
   * @param {number} params.limit - Number of results per page
   * @param {string} params.location - Job location filter
   * @param {string} params.experience - Experience range (e.g., "3-5")
   * @returns {Promise<Array>} - Array of job objects
   */
  async fetchJobsFromNaukri(params = {}) {
    try {
      const { keyword = '', page = 1, limit = 10, location = '', experience = '' } = params;
      
      const response = await axios.get(config.naukri.apiUrl, {
        params: {
          keyword,
          page,
          limit,
          location,
          experience,
          format: 'json'
        },
        headers: {
          'X-Api-Key': config.naukri.apiKey,
          'Accept': 'application/json'
        }
      });
      
      return this.formatNaukriJobs(response.data.jobListings || []);
    } catch (error) {
      logger.error('Error fetching jobs from Naukri API:', error);
      throw new AppError('Failed to fetch jobs from external API', 500);
    }
  }
  
  /**
   * Fetch jobs from LinkedIn API
   * @param {Object} params - Search parameters
   * @param {string} params.keyword - Search keyword
   * @param {number} params.page - Page number (starts from 1)
   * @param {number} params.limit - Number of results per page
   * @param {string} params.location - Job location filter
   * @returns {Promise<Array>} - Array of job objects
   */
  async fetchJobsFromLinkedIn(params = {}) {
    try {
      const { keyword = '', page = 1, limit = 10, location = '' } = params;
      
      const response = await axios.get(config.linkedin.jobApiUrl, {
        params: {
          keywords: keyword,
          start: (page - 1) * limit,
          count: limit,
          location,
          format: 'json'
        },
        headers: {
          'Authorization': `Bearer ${config.linkedin.apiKey}`,
          'Accept': 'application/json'
        }
      });
      
      return this.formatLinkedInJobs(response.data.jobs || []);
    } catch (error) {
      logger.error('Error fetching jobs from LinkedIn API:', error);
      throw new AppError('Failed to fetch jobs from external API', 500);
    }
  }
  
  /**
   * Format Naukri API job data to match our application's job model
   * @param {Array} jobs - Raw job data from Naukri API
   * @returns {Array} - Formatted job objects
   */
  formatNaukriJobs(jobs) {
    return jobs.map(job => ({
      source: 'naukri',
      source_id: job.jobId.toString(),
      title: job.title,
      company: {
        name: job.companyName,
        logo_url: job.companyLogoUrl || '',
        location: job.location || '',
        website: job.companyUrl || ''
      },
      description: job.jobDescription,
      responsibilities: job.keySkills ? job.keySkills.join(', ') : '',
      requirements: job.eligibility || '',
      skills: job.keySkills || [],
      application_url: job.applyUrl,
      job_type: job.jobType || 'full-time',
      salary_range: job.salary || '',
      location: job.location || '',
      remote: job.isRemote === true,
      experience_level: job.experience || '',
      posted_at: job.postDate ? new Date(job.postDate) : new Date(),
      deadline: job.expiryDate ? new Date(job.expiryDate) : null
    }));
  }
  
  /**
   * Format LinkedIn API job data to match our application's job model
   * @param {Array} jobs - Raw job data from LinkedIn API
   * @returns {Array} - Formatted job objects
   */
  formatLinkedInJobs(jobs) {
    return jobs.map(job => ({
      source: 'linkedin',
      source_id: job.id.toString(),
      title: job.title,
      company: {
        name: job.company.name,
        logo_url: job.company.logoUrl || '',
        location: job.company.location || '',
        website: job.company.url || ''
      },
      description: job.description,
      responsibilities: job.description,
      requirements: job.description,
      skills: job.skills || [],
      application_url: job.applyUrl,
      job_type: job.jobType || 'full-time',
      salary_range: '',
      location: job.location.name || '',
      remote: job.remoteType === 'REMOTE',
      experience_level: job.experienceLevel || '',
      posted_at: job.postedAt ? new Date(job.postedAt) : new Date(),
      deadline: null
    }));
  }
  
  /**
   * Import a job from an external API to our database
   * @param {Object} job - Job data
   * @param {string} source - Source of the job (naukri, linkedin)
   * @returns {Promise<Object>} - Created job object
   */
  async importJobToDatabase(job, source) {
    try {
      // Implementation would depend on your database model
      // This would typically call your jobService to create a new job
      // return await jobService.createJob({
      //   title: job.title,
      //   company_id: /* would need to find or create company */,
      //   description: job.description,
      //   responsibilities: job.responsibilities,
      //   requirements: job.requirements,
      //   skills: job.skills,
      //   application_url: job.application_url,
      //   source,
      //   source_id: job.source_id,
      //   /* other fields */
      // });
      
      // This is a placeholder - actual implementation would save to your database
      return job;
    } catch (error) {
      logger.error('Error importing job to database:', error);
      throw new AppError('Failed to import job', 500);
    }
  }
}

module.exports = new JobApiService(); 