import axios from 'axios';
import {
  FETCH_NOTIFICATIONS_LOADING,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_ERROR,
  MARK_NOTIFICATION_READ,
  MARK_ALL_NOTIFICATIONS_READ
} from './actionTypes';
import { setAlert } from './uiActions';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Fetch user notifications
export const fetchNotifications = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_NOTIFICATIONS_LOADING });
    
    const { token } = getState().auth;
    const config = { headers: { 'Authorization': `Bearer ${token}` } };
    
    const res = await axios.get(`${API_URL}/notifications`, config);
    
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
export const markNotificationRead = (notificationId) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const config = { headers: { 'Authorization': `Bearer ${token}` } };
    
    await axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, config);
    
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
export const markAllNotificationsRead = () => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const config = { headers: { 'Authorization': `Bearer ${token}` } };
    
    await axios.put(`${API_URL}/notifications/read-all`, {}, config);
    
    dispatch({ type: MARK_ALL_NOTIFICATIONS_READ });
    dispatch(setAlert('All notifications marked as read', 'success'));
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to mark all notifications as read';
    dispatch(setAlert(errorMessage, 'error'));
  }
}; 