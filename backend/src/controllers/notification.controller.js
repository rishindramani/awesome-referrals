const { Notification, User } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Get all notifications for the current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit: 50 // Limit to the 50 most recent notifications
    });
    
    // Count unread notifications
    const unreadCount = notifications.filter(n => !n.read).length;
    
    res.status(200).json({
      status: 'success',
      results: notifications.length,
      unreadCount,
      notifications
    });
  } catch (error) {
    logger.error('Failed to fetch notifications:', error);
    next(new AppError('Failed to fetch notifications', 500));
  }
};

/**
 * Mark a single notification as read
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.markAsRead = async (req, res, next) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;
    
    // Find the notification and ensure it belongs to the current user
    const notification = await Notification.findOne({
      where: { 
        id: notificationId,
        user_id: userId
      }
    });
    
    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }
    
    // Update the notification
    notification.read = true;
    await notification.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        notification
      }
    });
  } catch (error) {
    logger.error('Failed to mark notification as read:', error);
    next(new AppError('Failed to mark notification as read', 500));
  }
};

/**
 * Mark all notifications as read for the current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Update all unread notifications for the user
    await Notification.update(
      { read: true },
      { 
        where: { 
          user_id: userId,
          read: false
        }
      }
    );
    
    res.status(200).json({
      status: 'success',
      message: 'All notifications marked as read'
    });
  } catch (error) {
    logger.error('Failed to mark all notifications as read:', error);
    next(new AppError('Failed to mark all notifications as read', 500));
  }
};

/**
 * Create a notification for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createNotification = async (req, res, next) => {
  try {
    const { userId, type, title, message, relatedEntityId, relatedEntityType } = req.body;
    
    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    
    // Create the notification
    const notification = await Notification.create({
      user_id: userId,
      type,
      title,
      message,
      related_entity_id: relatedEntityId,
      related_entity_type: relatedEntityType,
      read: false
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        notification
      }
    });
  } catch (error) {
    logger.error('Failed to create notification:', error);
    next(new AppError('Failed to create notification', 500));
  }
};

/**
 * Delete a notification
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deleteNotification = async (req, res, next) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;
    
    // Find the notification and ensure it belongs to the current user
    const notification = await Notification.findOne({
      where: { 
        id: notificationId,
        user_id: userId
      }
    });
    
    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }
    
    // Delete the notification
    await notification.destroy();
    
    res.status(200).json({
      status: 'success',
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    logger.error('Failed to delete notification:', error);
    next(new AppError('Failed to delete notification', 500));
  }
};

/**
 * Utility function to create notifications (for internal use)
 * @param {Object} notificationData - Notification data
 * @returns {Promise<Object>} - Created notification
 */
exports.createNotificationForUser = async (notificationData) => {
  try {
    const { userId, type, title, message, relatedEntityId, relatedEntityType } = notificationData;
    
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
    logger.error('Failed to create notification internally:', error);
    throw error;
  }
}; 