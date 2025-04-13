const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ReferralRequest = sequelize.define('ReferralRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  job_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'jobs',
      key: 'id'
    }
  },
  seeker_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  referrer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM(
      'pending', 
      'accepted', 
      'declined', 
      'interview_scheduled', 
      'hired', 
      'closed'
    ),
    defaultValue: 'pending'
  },
  message: {
    type: DataTypes.TEXT
  },
  resume_url: {
    type: DataTypes.STRING
  },
  completed_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'referral_requests',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['job_id']
    },
    {
      fields: ['seeker_id']
    },
    {
      fields: ['referrer_id']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = ReferralRequest; 