import {
  FETCH_NOTIFICATIONS_LOADING,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_ERROR,
  MARK_NOTIFICATION_READ,
  MARK_ALL_NOTIFICATIONS_READ
} from './actionTypes';
import { setAlert } from './uiActions';
import api from '../../services/apiService';

// Fetch user notifications
export const fetchNotifications = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_NOTIFICATIONS_LOADING });
    
    const res = await api.get('/notifications');
    
    dispatch({
      type: FETCH_NOTIFICATIONS_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch notifications';
    dispatch({ type: FETCH_NOTIFICATIONS_ERROR, payload: errorMessage });
  }
};

// Mark a notification as read
export const markNotificationRead = (notificationId) => async (dispatch) => {
  try {
    await api.put(`/notifications/${notificationId}/read`, {});
    
    dispatch({
      type: MARK_NOTIFICATION_READ,
      payload: notificationId
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to mark notification as read';
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Mark all notifications as read
export const markAllNotificationsRead = () => async (dispatch) => {
  try {
    await api.put('/notifications/read-all', {});
    
    dispatch({ type: MARK_ALL_NOTIFICATIONS_READ });
    dispatch(setAlert('All notifications marked as read', 'success'));
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to mark all notifications as read';
    dispatch(setAlert(errorMessage, 'error'));
  }
}; 