import {
  FETCH_NOTIFICATIONS_LOADING,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_ERROR,
  MARK_NOTIFICATION_READ,
  MARK_ALL_NOTIFICATIONS_READ
} from '../actions/actionTypes';

const initialState = {
  notifications: [],
  loading: false,
  error: null,
  unreadCount: 0
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NOTIFICATIONS_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case FETCH_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        notifications: action.payload.notifications,
        unreadCount: action.payload.notifications.filter(n => !n.isRead).length,
        loading: false,
        error: null
      };
    
    case FETCH_NOTIFICATIONS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification => 
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    
    case MARK_ALL_NOTIFICATIONS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true
        })),
        unreadCount: 0
      };
    
    default:
      return state;
  }
};

export default notificationReducer; 