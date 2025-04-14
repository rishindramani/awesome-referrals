const { Notification, User } = require('../models');
const logger = require('../utils/logger');

/**
 * NotificationService handles creating and managing notifications.
 * This service is used by other controllers to send notifications.
 */
class NotificationService {
  /**
   * Create a notification for a user
   * @param {Object} notificationData - Notification data
   * @returns {Promise<Object>} - Created notification
   */
  static async createNotification(notificationData) {
    try {
      const { userId, type, title, message, relatedEntityId, relatedEntityType } = notificationData;
      
      // Verify user exists
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }
      
      // Create the notification
      const notification = await Notification.create({
        user_id: userId,
        type,
        title,
        message,
        related_entity_id: relatedEntityId || null,
        related_entity_type: relatedEntityType || null,
        read: false
      });
      
      logger.info(`Notification created for user ${userId}: ${type}`);
      return notification;
    } catch (error) {
      logger.error('Failed to create notification:', error);
      throw error;
    }
  }
  
  /**
   * Send a referral request notification
   * @param {Object} data - Referral request data
   * @returns {Promise<Object>} - Created notification
   */
  static async sendReferralRequestNotification(data) {
    const { referrerId, seekerName, jobTitle, companyName, referralId } = data;
    
    return this.createNotification({
      userId: referrerId,
      type: 'referral_request',
      title: 'New Referral Request',
      message: `${seekerName} has requested a referral for the ${jobTitle} position at ${companyName}.`,
      relatedEntityId: referralId,
      relatedEntityType: 'referral'
    });
  }
  
  /**
   * Send a referral status update notification
   * @param {Object} data - Referral status data
   * @returns {Promise<Object>} - Created notification
   */
  static async sendReferralStatusNotification(data) {
    const { seekerId, referrerName, status, jobTitle, companyName, referralId } = data;
    
    let title = '';
    let message = '';
    let type = '';
    
    switch (status) {
      case 'accepted':
        title = 'Referral Request Accepted';
        message = `${referrerName} has accepted your referral request for the ${jobTitle} position at ${companyName}.`;
        type = 'referral_accepted';
        break;
      case 'rejected':
        title = 'Referral Request Declined';
        message = `${referrerName} has declined your referral request for the ${jobTitle} position at ${companyName}.`;
        type = 'referral_rejected';
        break;
      case 'interview_scheduled':
        title = 'Interview Scheduled';
        message = `Your referral for the ${jobTitle} position at ${companyName} has progressed to the interview stage.`;
        type = 'interview_scheduled';
        break;
      case 'hired':
        title = 'Congratulations! You Got Hired';
        message = `Congratulations! You have been hired for the ${jobTitle} position at ${companyName}.`;
        type = 'hired';
        break;
      default:
        title = 'Referral Status Update';
        message = `Your referral request for ${jobTitle} at ${companyName} has been updated to ${status}.`;
        type = 'referral_update';
    }
    
    return this.createNotification({
      userId: seekerId,
      type,
      title,
      message,
      relatedEntityId: referralId,
      relatedEntityType: 'referral'
    });
  }
  
  /**
   * Send a job match notification
   * @param {Object} data - Job match data
   * @returns {Promise<Object>} - Created notification
   */
  static async sendJobMatchNotification(data) {
    const { userId, jobId, jobTitle, companyName } = data;
    
    return this.createNotification({
      userId,
      type: 'job_match',
      title: 'New Job Match',
      message: `We've found a new job match for you: ${jobTitle} at ${companyName}.`,
      relatedEntityId: jobId,
      relatedEntityType: 'job'
    });
  }
  
  /**
   * Send a message notification
   * @param {Object} data - Message data
   * @returns {Promise<Object>} - Created notification
   */
  static async sendMessageNotification(data) {
    const { userId, senderId, senderName, messageContent, messageId } = data;
    
    return this.createNotification({
      userId,
      type: 'message',
      title: 'New Message',
      message: `${senderName}: ${messageContent.substring(0, 50)}${messageContent.length > 50 ? '...' : ''}`,
      relatedEntityId: messageId,
      relatedEntityType: 'message'
    });
  }
  
  /**
   * Send a reward notification
   * @param {Object} data - Reward data
   * @returns {Promise<Object>} - Created notification
   */
  static async sendRewardNotification(data) {
    const { userId, pointsEarned, totalPoints, reason } = data;
    
    return this.createNotification({
      userId,
      type: 'reward',
      title: 'Points Earned',
      message: `You've earned ${pointsEarned} points for: ${reason}. Your total is now ${totalPoints} points.`,
      relatedEntityType: 'reward'
    });
  }
}

module.exports = NotificationService; 