const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Please provide a valid email address'
      }
    }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_type: {
    type: DataTypes.ENUM('job_seeker', 'referrer', 'admin'),
    allowNull: false,
    defaultValue: 'job_seeker'
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profile_picture_url: {
    type: DataTypes.STRING
  },
  linkedin_url: {
    type: DataTypes.STRING,
    validate: {
      isUrl: {
        msg: 'Please provide a valid LinkedIn URL'
      }
    }
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verification_method: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.VIRTUAL,
    validate: {
      len: {
        args: [8, 100],
        msg: 'Password must be between 8 and 100 characters'
      }
    }
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Method to check if password is correct
User.prototype.validatePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

// Exclude password hash from JSON
User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password_hash;
  return values;
};

module.exports = User; 