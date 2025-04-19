import {
  FETCH_NOTIFICATIONS_LOADING,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_ERROR,
  MARK_NOTIFICATION_READ,
  MARK_ALL_NOTIFICATIONS_READ,
  DELETE_NOTIFICATION_SUCCESS
} from './actionTypes';
import { setAlert } from './uiActions';
import { apiService } from '../../services/apiService';

// Fetch user notifications
export const fetchNotifications = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_NOTIFICATIONS_LOADING });
    
    const response = await apiService.notifications.getAll();
    
    dispatch({
      type: FETCH_NOTIFICATIONS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch notifications';
    
    dispatch({ 
      type: FETCH_NOTIFICATIONS_ERROR, 
      payload: errorMessage 
    });
    
    dispatch(setAlert(errorMessage, 'error'));
    return null;
  }
};

// Mark a notification as read
export const markNotificationRead = (notificationId) => async (dispatch) => {
  try {
    const response = await apiService.notifications.markAsRead(notificationId);
    
    dispatch({
      type: MARK_NOTIFICATION_READ,
      payload: notificationId
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to mark notification as read';
    
    dispatch(setAlert(errorMessage, 'error'));
    return null;
  }
};

// Mark all notifications as read
export const markAllNotificationsRead = () => async (dispatch) => {
  try {
    const response = await apiService.notifications.markAllAsRead();
    
    dispatch({ type: MARK_ALL_NOTIFICATIONS_READ });
    dispatch(setAlert('All notifications marked as read', 'success'));
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to mark all notifications as read';
    
    dispatch(setAlert(errorMessage, 'error'));
    return null;
  }
};

// Delete a notification
export const deleteNotification = (notificationId) => async (dispatch) => {
  try {
    await apiService.notifications.delete(notificationId);
    
    dispatch({
      type: DELETE_NOTIFICATION_SUCCESS,
      payload: notificationId
    });
    
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to delete notification';
    
    dispatch(setAlert(errorMessage, 'error'));
    return null;
  }
}; 