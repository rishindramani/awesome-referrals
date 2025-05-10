const { Job, Company, JobSkill, Skill, User, SavedJob } = require('../models');
const { Op } = require('sequelize');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// Get all jobs with filtering and pagination
exports.getJobs = async (req, res, next) => {
  try {
    const {
      title,
      company,
      location,
      type,
      experience_level,
      salary_min,
      salary_max,
      skills,
      remote,
      page = 1,
      limit = 10,
      sort_by = 'created_at',
      sort_dir = 'DESC'
    } = req.query;

    // Build filters
    const filters = {};
    
    if (title) {
      filters.title = { [Op.iLike]: `%${title}%` };
    }
    
    if (location) {
      filters.location = { [Op.iLike]: `%${location}%` };
    }
    
    if (type) {
      filters.job_type = type;
    }
    
    if (experience_level) {
      filters.experience_level = experience_level;
    }
    
    if (salary_min) {
      filters.salary_min = { [Op.gte]: parseFloat(salary_min) };
    }
    
    if (salary_max) {
      filters.salary_max = { [Op.lte]: parseFloat(salary_max) };
    }
    
    if (remote === 'true') {
      filters.is_remote = true;
    } else if (remote === 'false') {
      filters.is_remote = false;
    }
    
    // Company filter
    const companyFilter = company ? {
      name: { [Op.iLike]: `%${company}%` }
    } : {};
    
    // Parse skills if provided
    const skillsArray = skills ? skills.split(',').map(s => s.trim()) : [];
    
    // Calculate offset for pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Define sorting
    const order = [[sort_by, sort_dir]];
    
    // Build query with includes
    const query = {
      where: filters,
      include: [
        {
          model: Company,
          as: 'company',
          where: companyFilter,
          attributes: ['id', 'name', 'logo_url', 'website']
        }
      ],
      offset,
      limit: parseInt(limit),
      order,
      distinct: true
    };
    
    // Add skills filter if provided
    if (skillsArray.length > 0) {
      query.include.push({
        model: Skill,
        as: 'skills',
        attributes: ['id', 'name'],
        through: { attributes: [] },
        where: {
          name: { [Op.in]: skillsArray }
        }
      });
    } else {
      // Include skills without filtering
      query.include.push({
        model: Skill,
        as: 'skills',
        attributes: ['id', 'name'],
        through: { attributes: [] }
      });
    }
    
    // Execute query
    const { rows, count } = await Job.findAndCountAll(query);
    
    // Calculate total pages
    const totalPages = Math.ceil(count / parseInt(limit));
    
    res.status(200).json({
      status: 'success',
      results: rows.length,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: totalPages
      },
      data: {
        jobs: rows
      }
    });
  } catch (error) {
    logger.error('Error getting jobs:', error);
    next(error);
  }
};

// Advanced search for jobs
exports.searchJobs = async (req, res, next) => {
  try {
    const {
      query,
      location,
      remote,
      company_ids,
      job_types,
      experience_levels,
      salary_min,
      salary_max,
      skills,
      posted_within,
      page = 1,
      limit = 10,
      sort_by = 'relevance', // relevance, date, salary
      sort_dir = 'DESC'
    } = req.query;

    // Build base filters
    const filters = {};
    
    // Full-text search (search in title, description, responsibilities, requirements)
    if (query) {
      filters[Op.or] = [
        { title: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
        { responsibilities: { [Op.iLike]: `%${query}%` } },
        { requirements: { [Op.iLike]: `%${query}%` } }
      ];
    }
    
    // Location filter
    if (location) {
      filters.location = { [Op.iLike]: `%${location}%` };
    }
    
    // Remote work filter
    if (remote === 'true') {
      filters.is_remote = true;
    } else if (remote === 'false') {
      filters.is_remote = false;
    }
    
    // Job types filter (can be multiple)
    if (job_types) {
      const typesArray = job_types.split(',');
      filters.job_type = { [Op.in]: typesArray };
    }
    
    // Experience levels filter (can be multiple)
    if (experience_levels) {
      const levelsArray = experience_levels.split(',');
      filters.experience_level = { [Op.in]: levelsArray };
    }
    
    // Salary range filter
    if (salary_min) {
      filters.salary_min = { [Op.gte]: parseFloat(salary_min) };
    }
    
    if (salary_max) {
      filters.salary_max = { [Op.lte]: parseFloat(salary_max) };
    }
    
    // Posted within filter (in days)
    if (posted_within) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(posted_within));
      filters.created_at = { [Op.gte]: daysAgo };
    }
    
    // Company filter (can be multiple company IDs)
    const companyFilter = {};
    if (company_ids) {
      const idsArray = company_ids.split(',').map(id => parseInt(id, 10));
      companyFilter.id = { [Op.in]: idsArray };
    }
    
    // Parse skills if provided
    const skillsArray = skills ? skills.split(',').map(s => s.trim()) : [];
    
    // Calculate offset for pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Define sorting
    let order;
    switch(sort_by) {
      case 'date':
        order = [['created_at', sort_dir]];
        break;
      case 'salary':
        order = [['salary_max', sort_dir]];
        break;
      case 'relevance':
      default:
        // For relevance sorting, prioritize exact matches in title
        // This is a simplified approach; a real system would use more sophisticated ranking
        if (query) {
          order = [
            [Sequelize.literal(`CASE WHEN title ILIKE '%${query}%' THEN 0 ELSE 1 END`), 'ASC'],
            ['created_at', 'DESC']
          ];
        } else {
          order = [['created_at', 'DESC']];
        }
        break;
    }
    
    // Build query with includes
    const queryOptions = {
      where: filters,
      include: [
        {
          model: Company,
          as: 'company',
          where: companyFilter,
          attributes: ['id', 'name', 'logo_url', 'website']
        }
      ],
      offset,
      limit: parseInt(limit),
      order,
      distinct: true
    };
    
    // Add skills filter if provided
    if (skillsArray.length > 0) {
      queryOptions.include.push({
        model: Skill,
        as: 'skills',
        attributes: ['id', 'name'],
        through: { attributes: [] },
        where: {
          name: { [Op.in]: skillsArray }
        }
      });
    } else {
      // Include skills without filtering
      queryOptions.include.push({
        model: Skill,
        as: 'skills',
        attributes: ['id', 'name'],
        through: { attributes: [] }
      });
    }
    
    // Add saved status if user is authenticated
    if (req.user) {
      queryOptions.include.push({
        model: User,
        as: 'savedByUsers',
        attributes: ['id'],
        through: { attributes: [] },
        where: { id: req.user.id },
        required: false
      });
    }
    
    // Execute query
    const { rows, count } = await Job.findAndCountAll(queryOptions);
    
    // Process results to add isSaved flag
    const processedJobs = rows.map(job => {
      const jobData = job.toJSON();
      
      // Add isSaved flag if user is authenticated
      if (req.user) {
        jobData.isSaved = !!jobData.savedByUsers && jobData.savedByUsers.length > 0;
        delete jobData.savedByUsers; // Remove the savedByUsers array
      }
      
      return jobData;
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(count / parseInt(limit));
    
    res.status(200).json({
      status: 'success',
      results: processedJobs.length,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: totalPages
      },
      data: {
        jobs: processedJobs
      }
    });
  } catch (error) {
    logger.error('Error searching jobs:', error);
    next(error);
  }
};

// Get a single job by ID
exports.getJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const job = await Job.findByPk(id, {
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'logo_url', 'website', 'description']
        },
        {
          model: Skill,
          as: 'skills',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    });
    
    if (!job) {
      return next(new AppError('Job not found', 404));
    }
    
    // Check if job is saved by user if authenticated
    let isSaved = false;
    if (req.user) {
      const savedJob = await SavedJob.findOne({
        where: {
          user_id: req.user.id,
          job_id: id
        }
      });
      isSaved = !!savedJob;
    }
    
    // Add isSaved to job data
    const jobData = job.toJSON();
    jobData.isSaved = isSaved;
    
    res.status(200).json({
      status: 'success',
      data: {
        job: jobData
      }
    });
  } catch (error) {
    logger.error('Error getting job:', error);
    next(error);
  }
};

// Get saved jobs for current user
exports.getSavedJobs = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      page = 1,
      limit = 10,
      sort_by = 'created_at',
      sort_dir = 'DESC'
    } = req.query;
    
    // Calculate offset for pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Define sorting
    const order = [[sort_by, sort_dir]];
    
    // Query saved jobs
    const { rows, count } = await Job.findAndCountAll({
      include: [
        {
          model: User,
          as: 'savedByUsers',
          where: { id: userId },
          attributes: [],
          through: { attributes: [] }
        },
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'logo_url', 'website']
        },
        {
          model: Skill,
          as: 'skills',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ],
      offset,
      limit: parseInt(limit),
      order,
      distinct: true
    });
    
    // Process results to add isSaved flag
    const processedJobs = rows.map(job => {
      const jobData = job.toJSON();
      jobData.isSaved = true; // These are saved jobs by definition
      return jobData;
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(count / parseInt(limit));
    
    res.status(200).json({
      status: 'success',
      results: processedJobs.length,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: totalPages
      },
      data: {
        jobs: processedJobs
      }
    });
  } catch (error) {
    logger.error('Error getting saved jobs:', error);
    next(error);
  }
};

// Save a job
exports.saveJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if job exists
    const job = await Job.findByPk(id);
    if (!job) {
      return next(new AppError('Job not found', 404));
    }
    
    // Check if already saved
    const existingSave = await SavedJob.findOne({
      where: {
        user_id: userId,
        job_id: id
      }
    });
    
    if (existingSave) {
      return res.status(200).json({
        status: 'success',
        message: 'Job already saved'
      });
    }
    
    // Save the job
    await SavedJob.create({
      user_id: userId,
      job_id: id
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Job saved successfully'
    });
  } catch (error) {
    logger.error('Error saving job:', error);
    next(error);
  }
};

// Unsave a job
exports.unsaveJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Remove the saved job record
    const result = await SavedJob.destroy({
      where: {
        user_id: userId,
        job_id: id
      }
    });
    
    if (result === 0) {
      return next(new AppError('Job not found in saved jobs', 404));
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Job removed from saved jobs'
    });
  } catch (error) {
    logger.error('Error removing saved job:', error);
    next(error);
  }
};

// Create a new job
exports.createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      company_id,
      location,
      is_remote,
      job_type,
      experience_level,
      salary_min,
      salary_max,
      responsibilities,
      requirements,
      benefits,
      application_url,
      expiry_date,
      skills
    } = req.body;
    
    // Check if company exists
    const company = await Company.findByPk(company_id);
    if (!company) {
      return next(new AppError('Company not found', 404));
    }
    
    // Create job
    const job = await Job.create({
      title,
      description,
      company_id,
      location,
      is_remote,
      job_type,
      experience_level,
      salary_min,
      salary_max,
      responsibilities,
      requirements,
      benefits,
      application_url,
      expiry_date,
      created_by: req.user.id
    });
    
    // Add skills if provided
    if (skills && Array.isArray(skills) && skills.length > 0) {
      // Find or create each skill
      const skillPromises = skills.map(async (skillName) => {
        const [skill] = await Skill.findOrCreate({
          where: { name: skillName.trim().toLowerCase() }
        });
        return skill;
      });
      
      const skillInstances = await Promise.all(skillPromises);
      
      // Associate skills with job
      await job.setSkills(skillInstances);
    }
    
    // Fetch the complete job with relations
    const newJob = await Job.findByPk(job.id, {
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'logo_url', 'website']
        },
        {
          model: Skill,
          as: 'skills',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        job: newJob
      }
    });
  } catch (error) {
    logger.error('Error creating job:', error);
    next(error);
  }
};

// Update a job
exports.updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      location,
      is_remote,
      job_type,
      experience_level,
      salary_min,
      salary_max,
      responsibilities,
      requirements,
      benefits,
      application_url,
      expiry_date,
      skills
    } = req.body;
    
    // Find job
    const job = await Job.findByPk(id);
    
    if (!job) {
      return next(new AppError('Job not found', 404));
    }
    
    // Check ownership or admin rights
    if (job.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return next(new AppError('You do not have permission to update this job', 403));
    }
    
    // Update job
    await job.update({
      title,
      description,
      location,
      is_remote,
      job_type,
      experience_level,
      salary_min,
      salary_max,
      responsibilities,
      requirements,
      benefits,
      application_url,
      expiry_date
    });
    
    // Update skills if provided
    if (skills && Array.isArray(skills)) {
      // Find or create each skill
      const skillPromises = skills.map(async (skillName) => {
        const [skill] = await Skill.findOrCreate({
          where: { name: skillName.trim().toLowerCase() }
        });
        return skill;
      });
      
      const skillInstances = await Promise.all(skillPromises);
      
      // Replace existing skills with new ones
      await job.setSkills(skillInstances);
    }
    
    // Fetch updated job with relations
    const updatedJob = await Job.findByPk(id, {
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'logo_url', 'website']
        },
        {
          model: Skill,
          as: 'skills',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        job: updatedJob
      }
    });
  } catch (error) {
    logger.error('Error updating job:', error);
    next(error);
  }
};

// Delete a job
exports.deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find job
    const job = await Job.findByPk(id);
    
    if (!job) {
      return next(new AppError('Job not found', 404));
    }
    
    // Check ownership or admin rights
    if (job.created_by !== req.user.id && req.user.user_type !== 'admin') {
      return next(new AppError('You do not have permission to delete this job', 403));
    }
    
    // Delete job (this will also delete associated records through CASCADE)
    await job.destroy();
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    logger.error('Error deleting job:', error);
    next(error);
  }
};

// Get trending/recommended jobs
exports.getTrendingJobs = async (req, res, next) => {
  try {
    // This would typically involve more complex logic including user preferences,
    // popularity metrics, etc. For now, we'll simplify to recent jobs
    const trendingJobs = await Job.findAll({
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'logo_url']
        },
        {
          model: Skill,
          as: 'skills',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 10
    });
    
    res.status(200).json({
      status: 'success',
      results: trendingJobs.length,
      data: {
        jobs: trendingJobs
      }
    });
  } catch (error) {
    logger.error('Error getting trending jobs:', error);
    next(error);
  }
}; 