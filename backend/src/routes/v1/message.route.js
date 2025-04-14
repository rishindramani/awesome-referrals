const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const messageValidation = require('../../validations/message.validation');
const messageController = require('../../controllers/message.controller');

const router = express.Router();

// Routes for managing messages within a conversation
router
  .route('/conversations/:conversationId/messages')
  .post(
    auth('manageMessages'),
    validate(messageValidation.sendMessage),
    messageController.sendMessage
  )
  .get(
    auth('manageMessages'),
    validate(messageValidation.getMessages),
    messageController.getConversationMessages
  );

// Mark all messages in a conversation as read
router
  .route('/conversations/:conversationId/messages/read')
  .post(
    auth('manageMessages'),
    validate(messageValidation.markMessagesAsRead),
    messageController.markMessagesAsRead
  );

// Delete a specific message
router
  .route('/messages/:messageId')
  .delete(
    auth('manageMessages'),
    validate(messageValidation.deleteMessage),
    messageController.deleteMessage
  );

// Get unread message count
router
  .route('/messages/unread/count')
  .get(
    auth('manageMessages'),
    messageController.getUnreadMessageCount
  );

module.exports = router; 