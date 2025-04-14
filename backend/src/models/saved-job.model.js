const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * SavedJob Model
 * Represents jobs saved by users for later reference
 */
const SavedJob = sequelize.define('SavedJob', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Jobs',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Optional notes that users can add about the saved job'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'saved_jobs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false, // No need for updated_at since saves are one-time events
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'job_id'],
      name: 'saved_job_user_job_unique'
    }
  ]
});

module.exports = SavedJob; 