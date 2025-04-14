const Joi = require('joi');
const { objectId } = require('./custom.validation');

const sendMessage = {
  params: Joi.object().keys({
    conversationId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    content: Joi.string().required().trim().max(5000),
    attachments: Joi.array().items(
      Joi.object().keys({
        fileName: Joi.string().required(),
        fileType: Joi.string().required(),
        fileUrl: Joi.string().required(),
        fileSize: Joi.number().required(),
      })
    ),
    referralRequest: Joi.string().custom(objectId),
  }),
};

const getMessages = {
  params: Joi.object().keys({
    conversationId: Joi.string().required().custom(objectId),
  }),
  query: Joi.object().keys({
    limit: Joi.number().integer().min(1).max(100),
    page: Joi.number().integer().min(1),
  }),
};

const markMessagesAsRead = {
  params: Joi.object().keys({
    conversationId: Joi.string().required().custom(objectId),
  }),
};

const deleteMessage = {
  params: Joi.object().keys({
    messageId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  sendMessage,
  getMessages,
  markMessagesAsRead,
  deleteMessage,
}; 