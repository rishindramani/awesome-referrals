const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const conversationValidation = require('../../validations/conversation.validation');
const conversationController = require('../../controllers/conversation.controller');

const router = express.Router();

// Create a new conversation
router
  .route('/')
  .post(
    auth('manageConversations'),
    validate(conversationValidation.createConversation),
    conversationController.createConversation
  )
  .get(
    auth('manageConversations'),
    validate(conversationValidation.getUserConversations),
    conversationController.getUserConversations
  );

// Get unread conversation count
router
  .route('/unread/count')
  .get(
    auth('manageConversations'),
    conversationController.getUnreadCount
  );

// Get, update, or archive a specific conversation
router
  .route('/:conversationId')
  .get(
    auth('manageConversations'),
    validate(conversationValidation.getConversation),
    conversationController.getConversation
  );

// Archive a conversation
router
  .route('/:conversationId/archive')
  .post(
    auth('manageConversations'),
    validate(conversationValidation.archiveConversation),
    conversationController.archiveConversation
  );

module.exports = router; 