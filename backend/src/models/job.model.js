const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  source_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  source_platform: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'naukri'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  requirements: {
    type: DataTypes.TEXT
  },
  location: {
    type: DataTypes.STRING
  },
  job_type: {
    type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'freelance', 'internship'),
    defaultValue: 'full-time'
  },
  experience_level: {
    type: DataTypes.STRING
  },
  salary_range: {
    type: DataTypes.STRING
  },
  application_url: {
    type: DataTypes.STRING,
    validate: {
      isUrl: {
        msg: 'Please provide a valid application URL'
      }
    }
  },
  posted_date: {
    type: DataTypes.DATE
  },
  company_id: {
    type: DataTypes.UUID,
    references: {
      model: 'companies',
      key: 'id'
    }
  }
}, {
  tableName: 'jobs',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['source_id', 'source_platform']
    }
  ]
});

module.exports = Job; 