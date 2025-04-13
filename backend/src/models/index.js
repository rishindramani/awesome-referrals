const User = require('./user.model');
const Company = require('./company.model');
const Job = require('./job.model');
const UserProfile = require('./user-profile.model');
const ReferralRequest = require('./referral-request.model');
const Notification = require('./notification.model');
const RewardPoints = require('./reward-points.model');
const Reward = require('./reward.model');

// Define associations
// User and UserProfile (One-to-One)
User.hasOne(UserProfile, { foreignKey: 'user_id', as: 'profile' });
UserProfile.belongsTo(User, { foreignKey: 'user_id' });

// Company and Jobs (One-to-Many)
Company.hasMany(Job, { foreignKey: 'company_id', as: 'jobs' });
Job.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// Company and UserProfile (One-to-Many)
Company.hasMany(UserProfile, { foreignKey: 'current_company_id', as: 'employees' });
UserProfile.belongsTo(Company, { foreignKey: 'current_company_id', as: 'company' });

// User and ReferralRequest (Seeker)
User.hasMany(ReferralRequest, { foreignKey: 'seeker_id', as: 'sentReferralRequests' });
ReferralRequest.belongsTo(User, { foreignKey: 'seeker_id', as: 'seeker' });

// User and ReferralRequest (Referrer)
User.hasMany(ReferralRequest, { foreignKey: 'referrer_id', as: 'receivedReferralRequests' });
ReferralRequest.belongsTo(User, { foreignKey: 'referrer_id', as: 'referrer' });

// Job and ReferralRequest (One-to-Many)
Job.hasMany(ReferralRequest, { foreignKey: 'job_id', as: 'referralRequests' });
ReferralRequest.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });

// User and Notification (One-to-Many)
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User and RewardPoints (One-to-Many)
User.hasMany(RewardPoints, { foreignKey: 'user_id', as: 'rewardPoints' });
RewardPoints.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ReferralRequest and RewardPoints (One-to-Many)
ReferralRequest.hasMany(RewardPoints, { foreignKey: 'referral_request_id', as: 'rewards' });
RewardPoints.belongsTo(ReferralRequest, { foreignKey: 'referral_request_id', as: 'referralRequest' });

module.exports = {
  User,
  Company,
  Job,
  UserProfile,
  ReferralRequest,
  Notification,
  RewardPoints,
  Reward
}; 