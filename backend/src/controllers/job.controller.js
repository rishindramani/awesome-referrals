const { Job, Company, JobSkill, Skill } = require('../models');
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
    
    res.status(200).json({
      status: 'success',
      data: {
        job
      }
    });
  } catch (error) {
    logger.error('Error getting job:', error);
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