const httpStatus = require('http-status');
const { Conversation, User, Message, sequelize } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a new conversation
 * @param {number} user1Id - First user ID
 * @param {number} user2Id - Second user ID
 * @param {Object} [options] - Optional parameters
 * @param {string} [options.title] - Optional conversation title
 * @param {number} [options.referralRequestId] - Optional referral request ID
 * @returns {Promise<Conversation>}
 */
const createConversation = async (user1Id, user2Id, options = {}) => {
  const t = await sequelize.transaction();

  try {
    // Check if conversation already exists between these users
    const existingConversation = await Conversation.findOne({
      include: [
        {
          model: User,
          as: 'participants',
          where: { id: user1Id },
          attributes: [],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'participants',
          where: { id: user2Id },
          attributes: [],
          through: { attributes: [] }
        }
      ],
      where: { isActive: true }
    });

    if (existingConversation) {
      await t.commit();
      return existingConversation;
    }

    // Create a new conversation
    const newConversation = await Conversation.create({
      title: options.title || null,
      referralRequestId: options.referralRequestId || null,
      lastActivityAt: new Date(),
    }, { transaction: t });

    // Add participants
    await newConversation.addParticipants([user1Id, user2Id], { transaction: t });

    await t.commit();
    
    return newConversation;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * Get conversation by ID
 * @param {number} id - Conversation ID
 * @returns {Promise<Conversation>}
 */
const getConversationById = async (id) => {
  return Conversation.findOne({
    where: { id, isActive: true },
    include: [
      {
        model: User,
        as: 'participants',
        attributes: ['id', 'name', 'email', 'avatar'],
        through: { attributes: [] }
      },
      {
        model: Message,
        as: 'lastMessage',
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'name', 'avatar']
          }
        ]
      }
    ]
  });
};

/**
 * Get conversations for a user
 * @param {number} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Paginated conversations
 */
const getUserConversations = async (userId, options) => {
  const { limit = 10, page = 1 } = options;
  const offset = (page - 1) * limit;

  const conversations = await Conversation.findAndCountAll({
    distinct: true,
    include: [
      {
        model: User,
        as: 'participants',
        where: { id: userId },
        attributes: [],
        through: { attributes: [] }
      },
      {
        model: User,
        as: 'participants',
        attributes: ['id', 'name', 'email', 'avatar'],
        through: { attributes: [] }
      },
      {
        model: Message,
        as: 'lastMessage',
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'name', 'avatar']
          }
        ]
      },
      {
        model: User,
        as: 'unreadBy',
        attributes: ['id'],
        through: { attributes: [] }
      }
    ],
    where: { isActive: true },
    order: [['lastActivityAt', 'DESC']],
    limit,
    offset,
  });

  return {
    results: conversations.rows,
    page,
    limit,
    totalPages: Math.ceil(conversations.count / limit),
    totalResults: conversations.count,
  };
};

/**
 * Update conversation last activity timestamp
 * @param {number} id - Conversation ID
 * @param {Object} [transaction] - Optional transaction
 * @returns {Promise<Conversation>}
 */
const updateLastActivity = async (id, transaction) => {
  const [updatedRowsCount, [conversation]] = await Conversation.update(
    { lastActivityAt: new Date() },
    { 
      where: { id },
      returning: true,
      transaction
    }
  );

  if (updatedRowsCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }

  return conversation;
};

/**
 * Update conversation's last message
 * @param {number} id - Conversation ID
 * @param {number} messageId - Message ID
 * @param {Object} [transaction] - Optional transaction
 * @returns {Promise<Conversation>}
 */
const updateLastMessage = async (id, messageId, transaction) => {
  const [updatedRowsCount, [conversation]] = await Conversation.update(
    { 
      lastMessageId: messageId,
      lastActivityAt: new Date()
    },
    { 
      where: { id },
      returning: true,
      transaction
    }
  );

  if (updatedRowsCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }

  return conversation;
};

/**
 * Archive a conversation (soft delete)
 * @param {number} id - Conversation ID
 * @param {number} userId - User requesting archival
 * @returns {Promise<Conversation>}
 */
const archiveConversation = async (id, userId) => {
  const conversation = await getConversationById(id);
  
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }
  
  // Verify user is part of the conversation
  const participants = await conversation.getParticipants();
  const isParticipant = participants.some(p => p.id === userId);
  
  if (!isParticipant) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not part of this conversation');
  }

  conversation.isActive = false;
  await conversation.save();
  
  return conversation;
};

/**
 * Get unread conversation count for a user
 * @param {number} userId - User ID
 * @returns {Promise<Number>} Count of conversations with unread messages
 */
const getUnreadConversationCount = async (userId) => {
  const count = await Conversation.count({
    include: [
      {
        model: User,
        as: 'unreadBy',
        where: { id: userId },
        attributes: [],
        through: { attributes: [] }
      }
    ],
    where: { isActive: true }
  });
  
  return count;
};

/**
 * Mark conversation as read for a user
 * @param {number} id - Conversation ID
 * @param {number} userId - User ID
 * @returns {Promise<Conversation>}
 */
const markConversationAsRead = async (id, userId) => {
  const conversation = await getConversationById(id);
  
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }
  
  // Verify user is part of the conversation
  const participants = await conversation.getParticipants();
  const isParticipant = participants.some(p => p.id === userId);
  
  if (!isParticipant) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not part of this conversation');
  }

  // Remove user from unreadBy
  await conversation.removeUnreadBy(userId);
  
  return conversation;
};

module.exports = {
  createConversation,
  getConversationById,
  getUserConversations,
  updateLastActivity,
  updateLastMessage,
  archiveConversation,
  getUnreadConversationCount,
  markConversationAsRead,
}; 