const httpStatus = require('http-status');
const { Message, Conversation } = require('../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { messageService, conversationService } = require('../services');

/**
 * Send a new message
 */
const sendMessage = catchAsync(async (req, res) => {
  const conversationId = req.params.conversationId;
  const message = await messageService.sendMessage(
    conversationId,
    req.user.id,
    req.body
  );
  
  // Mark as unread for recipient
  if (message.recipientId !== req.user.id) {
    const conversation = await conversationService.getConversationById(conversationId);
    if (conversation) {
      await conversation.addUnreadBy(message.recipientId);
    }
  }
  
  res.status(httpStatus.CREATED).send(message);
});

/**
 * Get messages for a conversation
 */
const getConversationMessages = catchAsync(async (req, res) => {
  const conversationId = req.params.conversationId;
  const options = {
    limit: parseInt(req.query.limit, 10) || 20,
    page: parseInt(req.query.page, 10) || 1,
  };
  
  const messages = await messageService.getConversationMessages(
    conversationId,
    req.user.id,
    options
  );
  
  // Mark conversation as read for this user
  await conversationService.markConversationAsRead(conversationId, req.user.id);
  
  res.send(messages);
});

/**
 * Mark all messages in a conversation as read
 */
const markMessagesAsRead = catchAsync(async (req, res) => {
  const conversationId = req.params.conversationId;
  const result = await messageService.markMessagesAsRead(conversationId, req.user.id);
  
  // Also mark the conversation as read
  await conversationService.markConversationAsRead(conversationId, req.user.id);
  
  res.send(result);
});

/**
 * Delete a message
 */
const deleteMessage = catchAsync(async (req, res) => {
  const messageId = req.params.messageId;
  const message = await messageService.deleteMessage(messageId, req.user.id);
  res.send(message);
});

/**
 * Get unread message count
 */
const getUnreadMessageCount = catchAsync(async (req, res) => {
  const count = await messageService.getUnreadMessageCount(req.user.id);
  const conversationCount = await conversationService.getUnreadConversationCount(req.user.id);
  
  res.send({
    unreadMessages: count,
    unreadConversations: conversationCount
  });
});

/**
 * Get conversation between current user and another user
 */
const getConversation = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { limit, page } = req.query;
  const conversation = await messageService.getConversation(req.user.id, userId, { limit, page });
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }
  res.send(conversation);
});

/**
 * Get all user's conversations
 */
const getUserConversations = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const conversations = await Conversation.find({
    $or: [{ user1: userId }, { user2: userId }]
  })
    .populate('user1', 'name email profilePicture')
    .populate('user2', 'name email profilePicture')
    .populate('lastMessage')
    .populate('referralId')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Conversation.countDocuments({
    $or: [{ user1: userId }, { user2: userId }]
  });

  res.send({
    results: conversations,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    totalResults: total
  });
});

/**
 * Mark message as read
 */
const markMessageAsRead = catchAsync(async (req, res) => {
  const { messageId } = req.params;
  const message = await messageService.markMessageAsRead(messageId, req.user.id);
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Mark all messages in a conversation as read
 */
const markConversationAsRead = catchAsync(async (req, res) => {
  const { userId } = req.params;
  await messageService.markConversationAsRead(req.user.id, userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  sendMessage,
  getUserConversations,
  getConversation,
  markConversationAsRead,
  markMessageAsRead,
  getConversationMessages,
  markMessagesAsRead,
  deleteMessage,
  getUnreadMessageCount,
}; 