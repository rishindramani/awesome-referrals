import {
  SET_ALERT,
  REMOVE_ALERT,
  SET_LOADING,
  CLEAR_LOADING,
  TOGGLE_SIDEBAR,
  TOGGLE_NOTIFICATION_PANEL,
  MARK_NOTIFICATION_READ,
  MARK_ALL_NOTIFICATIONS_READ
} from './actionTypes';
import { v4 as uuidv4 } from 'uuid';

// Set alert
export const setAlert = (message, type, timeout = 5000) => (dispatch) => {
  const id = uuidv4();
  
  dispatch({
    type: SET_ALERT,
    payload: { id, message, type }
  });
  
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};

// Set loading
export const setLoading = () => ({
  type: SET_LOADING
});

// Clear loading
export const clearLoading = () => ({
  type: CLEAR_LOADING
});

// Toggle sidebar
export const toggleSidebar = () => ({
  type: TOGGLE_SIDEBAR
});

// Toggle notification panel
export const toggleNotificationPanel = () => ({
  type: TOGGLE_NOTIFICATION_PANEL
});

// Mark notification as read
export const markNotificationRead = (notificationId) => ({
  type: MARK_NOTIFICATION_READ,
  payload: notificationId
});

// Mark all notifications as read
export const markAllNotificationsRead = () => ({
  type: MARK_ALL_NOTIFICATIONS_READ
}); 