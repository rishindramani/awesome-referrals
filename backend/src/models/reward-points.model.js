const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RewardPoints = sequelize.define('RewardPoints', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false
  },
  referral_request_id: {
    type: DataTypes.UUID,
    references: {
      model: 'referral_requests',
      key: 'id'
    }
  }
}, {
  tableName: 'reward_points',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  underscored: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['referral_request_id']
    }
  ]
});

module.exports = RewardPoints; 