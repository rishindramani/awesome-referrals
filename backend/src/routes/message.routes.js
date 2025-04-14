const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const message = require('../controllers/message.controller');
const validation = require('../validations/message.validation');
const validate = require('../middleware/validate');

// Routes for managing messages within a conversation
router.post(
  '/conversations/:conversationId/messages',
  auth.protect,
  validate(validation.sendMessage),
  message.sendMessage
);

router.get(
  '/conversations/:conversationId/messages',
  auth.protect,
  validate(validation.getMessages),
  message.getConversationMessages
);

// Mark all messages in a conversation as read
router.post(
  '/conversations/:conversationId/messages/read',
  auth.protect,
  validate(validation.markMessagesAsRead),
  message.markMessagesAsRead
);

// Delete a specific message
router.delete(
  '/:messageId',
  auth.protect,
  validate(validation.deleteMessage),
  message.deleteMessage
);

// Get unread message count
router.get(
  '/unread/count',
  auth.protect,
  message.getUnreadMessageCount
);

module.exports = router; 