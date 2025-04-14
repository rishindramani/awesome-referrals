const { sequelize } = require('../config/database');
const User = require('./user.model');
const Message = require('./message.model');
const Conversation = require('./conversation.model');
const ReferralRequest = require('./referral-request.model');

// Set up associations
Message.associate({ User, Conversation, ReferralRequest });
Conversation.associate({ User, Message, ReferralRequest });

// Create db object with all models
const db = {
  User,
  Message,
  Conversation,
  ReferralRequest,
  sequelize
};

module.exports = db; 