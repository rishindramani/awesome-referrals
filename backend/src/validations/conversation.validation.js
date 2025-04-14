const Joi = require('joi');

const createConversation = {
  body: Joi.object().keys({
    userId: Joi.number().integer().required(),
    title: Joi.string().max(100),
    referralRequestId: Joi.number().integer(),
  }),
};

const getUserConversations = {
  query: Joi.object().keys({
    limit: Joi.number().integer().min(1).max(50),
    page: Joi.number().integer().min(1),
  }),
};

const getConversation = {
  params: Joi.object().keys({
    conversationId: Joi.number().integer().required(),
  }),
};

const archiveConversation = {
  params: Joi.object().keys({
    conversationId: Joi.number().integer().required(),
  }),
};

module.exports = {
  createConversation,
  getUserConversations,
  getConversation,
  archiveConversation,
}; 