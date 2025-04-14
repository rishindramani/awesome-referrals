const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Message extends Model {
  static associate(models) {
    this.belongsTo(models.Conversation, {
      foreignKey: 'conversationId',
      as: 'conversation',
    });
    
    this.belongsTo(models.User, {
      foreignKey: 'senderId',
      as: 'sender',
    });
    
    this.belongsTo(models.User, {
      foreignKey: 'recipientId',
      as: 'recipient',
    });
    
    if (models.ReferralRequest) {
      this.belongsTo(models.ReferralRequest, {
        foreignKey: 'referralRequestId',
        as: 'referralRequest',
      });
    }
  }
}

Message.init(
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    attachments: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Message',
    tableName: 'messages',
    timestamps: true,
    paranoid: true,
  }
);

module.exports = Message; 