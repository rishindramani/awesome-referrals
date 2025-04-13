import {
  SET_ALERT,
  REMOVE_ALERT,
  SET_LOADING,
  CLEAR_LOADING,
  TOGGLE_SIDEBAR,
  TOGGLE_NOTIFICATION_PANEL,
  MARK_NOTIFICATION_READ,
  MARK_ALL_NOTIFICATIONS_READ
} from '../actions/actionTypes';

const initialState = {
  loading: false,
  alerts: [],
  sidebarOpen: false,
  notificationPanelOpen: false,
  notifications: [],
  unreadNotificationsCount: 0
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true
      };
    
    case CLEAR_LOADING:
      return {
        ...state,
        loading: false
      };
    
    case SET_ALERT:
      return {
        ...state,
        alerts: [...state.alerts, action.payload]
      };
    
    case REMOVE_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter(alert => alert.id !== action.payload)
      };
    
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };
    
    case TOGGLE_NOTIFICATION_PANEL:
      return {
        ...state,
        notificationPanelOpen: !state.notificationPanelOpen
      };
    
    case MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification => 
          notification.id === action.payload ? { ...notification, read: true } : notification
        ),
        unreadNotificationsCount: state.unreadNotificationsCount - 1
      };
    
    case MARK_ALL_NOTIFICATIONS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification => ({ ...notification, read: true })),
        unreadNotificationsCount: 0
      };
    
    default:
      return state;
  }
};

export default uiReducer; 