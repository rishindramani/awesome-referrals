const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { conversationService } = require('../services');

/**
 * Create a new conversation
 */
const createConversation = catchAsync(async (req, res) => {
  const { userId, title, referralRequestId } = req.body;
  
  const conversation = await conversationService.createConversation(
    req.user.id,
    userId,
    { title, referralRequestId }
  );
  
  // Get full conversation with populated data
  const fullConversation = await conversationService.getConversationById(conversation.id);
  
  res.status(httpStatus.CREATED).send(fullConversation);
});

/**
 * Get a conversation by ID
 */
const getConversation = catchAsync(async (req, res) => {
  const conversation = await conversationService.getConversationById(req.params.conversationId);
  
  if (!conversation) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'Conversation not found' });
  }
  
  // Check if user is part of the conversation
  const participants = await conversation.getParticipants();
  const isParticipant = participants.some(p => p.id === req.user.id);
  
  if (!isParticipant) {
    return res.status(httpStatus.FORBIDDEN).send({ message: 'You are not part of this conversation' });
  }
  
  // Mark conversation as read
  await conversationService.markConversationAsRead(req.params.conversationId, req.user.id);
  
  res.send(conversation);
});

/**
 * Get all conversations for the logged-in user
 */
const getUserConversations = catchAsync(async (req, res) => {
  const options = {
    limit: parseInt(req.query.limit, 10) || 10,
    page: parseInt(req.query.page, 10) || 1,
  };
  
  const conversations = await conversationService.getUserConversations(req.user.id, options);
  res.send(conversations);
});

/**
 * Archive a conversation
 */
const archiveConversation = catchAsync(async (req, res) => {
  const conversation = await conversationService.archiveConversation(
    req.params.conversationId, 
    req.user.id
  );
  
  res.send(conversation);
});

/**
 * Get unread conversation count
 */
const getUnreadCount = catchAsync(async (req, res) => {
  const count = await conversationService.getUnreadConversationCount(req.user.id);
  res.send({ count });
});

module.exports = {
  createConversation,
  getConversation,
  getUserConversations,
  archiveConversation,
  getUnreadCount,
}; 