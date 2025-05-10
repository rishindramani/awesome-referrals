const { sequelize } = require('../config/database');
const User = require('./user.model');
const Message = require('./message.model');
const Conversation = require('./conversation.model');
const ReferralRequest = require('./referral-request.model');
const Company = require('./company.model');
const Job = require('./job.model');
const UserProfile = require('./user-profile.model');
const Notification = require('./notification.model');
const RewardPoints = require('./reward-points.model');
const Reward = require('./reward.model');
const SavedJob = require('./saved-job.model');

// Set up associations
Message.associate && Message.associate({ User, Conversation, ReferralRequest });
Conversation.associate && Conversation.associate({ User, Message, ReferralRequest });

// User and UserProfile relationships
User.hasOne(UserProfile, { foreignKey: 'user_id', as: 'profile' });
UserProfile.belongsTo(User, { foreignKey: 'user_id' });

// Company and Job relationships
Company.hasMany(Job, { foreignKey: 'company_id', as: 'jobs' });
Job.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// User and Notification relationships
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User and SavedJob relationships (many-to-many)
User.belongsToMany(Job, { through: SavedJob, foreignKey: 'user_id', otherKey: 'job_id', as: 'savedJobs' });
Job.belongsToMany(User, { through: SavedJob, foreignKey: 'job_id', otherKey: 'user_id', as: 'savedByUsers' });

// User and RewardPoints relationships
User.hasMany(RewardPoints, { foreignKey: 'user_id', as: 'rewardPoints' });
RewardPoints.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ReferralRequest relationships
User.hasMany(ReferralRequest, { foreignKey: 'seeker_id', as: 'sentReferralRequests' });
User.hasMany(ReferralRequest, { foreignKey: 'referrer_id', as: 'receivedReferralRequests' });
ReferralRequest.belongsTo(User, { foreignKey: 'seeker_id', as: 'seeker' });
ReferralRequest.belongsTo(User, { foreignKey: 'referrer_id', as: 'referrer' });
Job.hasMany(ReferralRequest, { foreignKey: 'job_id', as: 'referralRequests' });
ReferralRequest.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });

// Reward and RewardPoints relationships
Reward.hasMany(RewardPoints, { foreignKey: 'reward_id', as: 'rewardPoints' });
RewardPoints.belongsTo(Reward, { foreignKey: 'reward_id', as: 'reward' });

// Create db object with all models
const db = {
  User,
  Message,
  Conversation,
  ReferralRequest,
  Company,
  Job,
  UserProfile,
  Notification,
  RewardPoints,
  Reward,
  SavedJob,
  sequelize
};

module.exports = db; 