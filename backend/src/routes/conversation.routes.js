const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const conversation = require('../controllers/conversation.controller');
const validation = require('../validations/conversation.validation');
const validate = require('../middleware/validate');

// Create a new conversation
router.post(
  '/',
  auth.protect,
  validate(validation.createConversation),
  conversation.createConversation
);

// Get all conversations for the logged-in user
router.get(
  '/',
  auth.protect,
  validate(validation.getUserConversations),
  conversation.getUserConversations
);

// Get unread conversation count
router.get(
  '/unread/count',
  auth.protect,
  conversation.getUnreadCount
);

// Get a specific conversation
router.get(
  '/:conversationId',
  auth.protect,
  validate(validation.getConversation),
  conversation.getConversation
);

// Archive a conversation
router.post(
  '/:conversationId/archive',
  auth.protect,
  validate(validation.archiveConversation),
  conversation.archiveConversation
);

module.exports = router; 