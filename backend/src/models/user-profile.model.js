const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const config = require('../config');

const UserProfile = sequelize.define('UserProfile', {
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
    },
    unique: true
  },
  current_company_id: {
    type: DataTypes.UUID,
    references: {
      model: 'companies',
      key: 'id'
    }
  },
  current_position: {
    type: DataTypes.STRING
  },
  experience_years: {
    type: DataTypes.FLOAT
  },
  skills: {
    type: config.nodeEnv === 'development' ? DataTypes.TEXT : DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('skills');
      if (config.nodeEnv === 'development') {
        return rawValue ? JSON.parse(rawValue) : [];
      }
      return rawValue;
    },
    set(value) {
      if (config.nodeEnv === 'development') {
        this.setDataValue('skills', JSON.stringify(value || []));
      } else {
        this.setDataValue('skills', value);
      }
    }
  },
  resume_url: {
    type: DataTypes.STRING
  },
  bio: {
    type: DataTypes.TEXT
  },
  referral_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  success_rate: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }
}, {
  tableName: 'user_profiles',
  timestamps: true,
  underscored: true
});

module.exports = UserProfile; 