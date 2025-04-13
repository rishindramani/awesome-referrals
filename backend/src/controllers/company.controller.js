const { Company, Job } = require('../models');
const { Op } = require('sequelize');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// Get all companies with pagination
exports.getCompanies = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, name } = req.query;
    
    // Build filters
    const filters = {};
    if (name) {
      filters.name = { [Op.iLike]: `%${name}%` };
    }
    
    // Calculate offset
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const { rows, count } = await Company.findAndCountAll({
      where: filters,
      order: [['name', 'ASC']],
      limit: parseInt(limit),
      offset,
      attributes: { exclude: ['created_at', 'updated_at'] }
    });
    
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
        companies: rows
      }
    });
  } catch (error) {
    logger.error('Error getting companies:', error);
    next(error);
  }
};

// Get a single company by ID
exports.getCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const company = await Company.findByPk(id);
    
    if (!company) {
      return next(new AppError('Company not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        company
      }
    });
  } catch (error) {
    logger.error('Error getting company:', error);
    next(error);
  }
};

// Create a new company
exports.createCompany = async (req, res, next) => {
  try {
    const {
      name,
      logo_url,
      website,
      description,
      industry,
      size,
      headquarters,
      founded_year
    } = req.body;
    
    // Check if company already exists
    const existingCompany = await Company.findOne({ where: { name } });
    if (existingCompany) {
      return next(new AppError('A company with this name already exists', 400));
    }
    
    // Create company
    const company = await Company.create({
      name,
      logo_url,
      website,
      description,
      industry,
      size,
      headquarters,
      founded_year,
      created_by: req.user.id
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        company
      }
    });
  } catch (error) {
    logger.error('Error creating company:', error);
    next(error);
  }
};

// Update a company
exports.updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      logo_url,
      website,
      description,
      industry,
      size,
      headquarters,
      founded_year
    } = req.body;
    
    // Find company
    const company = await Company.findByPk(id);
    
    if (!company) {
      return next(new AppError('Company not found', 404));
    }
    
    // Check if admin
    if (req.user.user_type !== 'admin') {
      return next(new AppError('You do not have permission to update this company', 403));
    }
    
    // Update company
    await company.update({
      name,
      logo_url,
      website,
      description,
      industry,
      size,
      headquarters,
      founded_year
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        company
      }
    });
  } catch (error) {
    logger.error('Error updating company:', error);
    next(error);
  }
};

// Delete a company
exports.deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find company
    const company = await Company.findByPk(id);
    
    if (!company) {
      return next(new AppError('Company not found', 404));
    }
    
    // Check if admin
    if (req.user.user_type !== 'admin') {
      return next(new AppError('You do not have permission to delete this company', 403));
    }
    
    // Check if there are jobs associated with this company
    const jobCount = await Job.count({ where: { company_id: id } });
    
    if (jobCount > 0) {
      return next(new AppError('Cannot delete company with associated jobs', 400));
    }
    
    // Delete company
    await company.destroy();
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    logger.error('Error deleting company:', error);
    next(error);
  }
};

// Get company jobs
exports.getCompanyJobs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Check if company exists
    const company = await Company.findByPk(id);
    
    if (!company) {
      return next(new AppError('Company not found', 404));
    }
    
    // Calculate offset
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Get jobs for company
    const { rows, count } = await Job.findAndCountAll({
      where: { company_id: id },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
      attributes: { exclude: ['created_at', 'updated_at'] }
    });
    
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
    logger.error('Error getting company jobs:', error);
    next(error);
  }
}; 