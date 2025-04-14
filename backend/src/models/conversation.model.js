const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Conversation extends Model {
  static associate(models) {
    this.belongsToMany(models.User, { 
      through: 'ConversationParticipants',
      foreignKey: 'conversationId',
      otherKey: 'userId',
      as: 'participants'
    });
    
    this.belongsTo(models.Message, {
      foreignKey: 'lastMessageId',
      as: 'lastMessage'
    });
    
    if (models.ReferralRequest) {
      this.belongsTo(models.ReferralRequest, {
        foreignKey: 'referralRequestId',
        as: 'referralRequest'
      });
    }
    
    this.belongsToMany(models.User, { 
      through: 'UnreadConversations',
      foreignKey: 'conversationId',
      otherKey: 'userId',
      as: 'unreadBy'
    });
  }
}

Conversation.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastActivityAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Conversation',
    tableName: 'conversations',
    timestamps: true,
    paranoid: true,
  }
);

module.exports = Conversation; 