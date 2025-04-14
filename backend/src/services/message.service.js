const httpStatus = require('http-status');
const { Message, User, Conversation, sequelize } = require('../models');
const ApiError = require('../utils/ApiError');
const conversationService = require('./conversation.service');

/**
 * Send a new message
 * @param {number} conversationId - Conversation ID
 * @param {number} senderId - User sending the message
 * @param {Object} messageBody - Message data
 * @returns {Promise<Message>}
 */
const sendMessage = async (conversationId, senderId, messageBody) => {
  const t = await sequelize.transaction();
  
  try {
    // Get the conversation to verify it exists
    const conversation = await conversationService.getConversationById(conversationId);
    
    if (!conversation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
    }
    
    // Find participant who is not the sender
    const participants = await conversation.getParticipants();
    const recipient = participants.find(p => p.id !== senderId);
    
    if (!recipient) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot determine message recipient');
    }
    
    // Create the message
    const message = await Message.create({
      conversationId,
      senderId,
      recipientId: recipient.id,
      content: messageBody.content,
      attachments: messageBody.attachments || [],
    }, { transaction: t });
    
    // Update conversation with latest activity
    await conversationService.updateLastActivity(conversationId, t);
    await conversationService.updateLastMessage(conversationId, message.id, t);
    
    await t.commit();
    
    return message;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * Get messages for a conversation with pagination
 * @param {number} conversationId - Conversation ID
 * @param {number} userId - User requesting the messages
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Paginated messages
 */
const getConversationMessages = async (conversationId, userId, options) => {
  const conversation = await conversationService.getConversationById(conversationId);
  
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }
  
  // Check if user is part of the conversation
  const participants = await conversation.getParticipants();
  const isParticipant = participants.some(p => p.id === userId);
  
  if (!isParticipant) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not part of this conversation');
  }
  
  const { limit = 20, page = 1 } = options;
  const offset = (page - 1) * limit;
  
  const messages = await Message.findAndCountAll({
    where: { 
      conversationId: conversationId,
      isActive: true 
    },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [
      { 
        model: User,
        as: 'sender',
        attributes: ['id', 'name', 'email', 'avatar'] 
      },
      { 
        model: User,
        as: 'recipient',
        attributes: ['id', 'name', 'email', 'avatar'] 
      }
    ]
  });
  
  return {
    results: messages.rows,
    page,
    limit,
    totalPages: Math.ceil(messages.count / limit),
    totalResults: messages.count,
  };
};

/**
 * Mark messages as read
 * @param {number} conversationId - Conversation ID
 * @param {number} userId - User ID marking messages as read
 * @returns {Promise<Object>} Result with count of updated messages
 */
const markMessagesAsRead = async (conversationId, userId) => {
  const conversation = await conversationService.getConversationById(conversationId);
  
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }
  
  // Check if user is part of the conversation
  const participants = await conversation.getParticipants();
  const isParticipant = participants.some(p => p.id === userId);
  
  if (!isParticipant) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not part of this conversation');
  }
  
  // Mark unread messages sent to this user as read
  const [, updatedMessages] = await Message.update(
    {
      isRead: true,
      readAt: new Date(),
    },
    {
      where: {
        conversationId,
        recipientId: userId,
        isRead: false,
      },
      returning: true,
    }
  );
  
  return { updated: updatedMessages.length };
};

/**
 * Delete a message (soft delete)
 * @param {number} messageId - Message ID to delete
 * @param {number} userId - User requesting the deletion
 * @returns {Promise<Message>}
 */
const deleteMessage = async (messageId, userId) => {
  const message = await Message.findByPk(messageId);
  
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }
  
  // Check if user is the sender of the message
  if (message.senderId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only delete messages you have sent');
  }
  
  // If message was sent more than 5 minutes ago, don't allow deletion
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  if (message.createdAt < fiveMinutesAgo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Messages can only be deleted within 5 minutes of sending');
  }
  
  message.isActive = false;
  await message.save();
  
  return message;
};

/**
 * Get unread message count for a user
 * @param {number} userId - User ID
 * @returns {Promise<Number>} Count of unread messages
 */
const getUnreadMessageCount = async (userId) => {
  const count = await Message.count({
    where: {
      recipientId: userId,
      isRead: false,
      isActive: true,
    }
  });
  
  return count;
};

module.exports = {
  sendMessage,
  getConversationMessages,
  markMessagesAsRead,
  deleteMessage,
  getUnreadMessageCount,
}; 