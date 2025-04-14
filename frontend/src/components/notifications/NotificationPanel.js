import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  Divider,
  List,
  Button,
  Badge,
  CircularProgress,
  Toolbar,
  AppBar,
  Stack
} from '@mui/material';
import {
  Close as CloseIcon,
  Notifications as NotificationIcon,
  DoneAll as DoneAllIcon,
  Refresh as RefreshIcon,
  NotificationsOff as NotificationsOffIcon
} from '@mui/icons-material';
import { 
  fetchNotifications, 
  markNotificationRead, 
  markAllNotificationsRead,
  deleteNotification
} from '../../store/actions/notificationActions';
import { toggleNotificationPanel } from '../../store/actions/uiActions';
import NotificationItem from './NotificationItem';

const NotificationPanel = () => {
  const dispatch = useDispatch();
  const { isNotificationPanelOpen } = useSelector(state => state.ui);
  const { notifications, loading, unreadCount } = useSelector(state => state.notifications);

  useEffect(() => {
    if (isNotificationPanelOpen) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, isNotificationPanelOpen]);

  const handleClose = () => {
    dispatch(toggleNotificationPanel());
  };

  const handleNotificationRead = (notificationId) => {
    dispatch(markNotificationRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsRead());
  };
  
  const handleDeleteNotification = (notificationId) => {
    dispatch(deleteNotification(notificationId));
  };
  
  const handleRefresh = () => {
    dispatch(fetchNotifications());
  };

  return (
    <Drawer
      anchor="right"
      open={isNotificationPanelOpen}
      onClose={handleClose}
    >
      <Box sx={{ width: { xs: '100vw', sm: 400 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar>
            <Box display="flex" alignItems="center" width="100%" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationIcon />
                </Badge>
                <Typography variant="h6" sx={{ ml: 1.5 }}>
                  Notifications
                </Typography>
              </Box>
              <Box>
                <IconButton 
                  color="inherit" 
                  onClick={handleRefresh} 
                  aria-label="refresh"
                  disabled={loading}
                >
                  <RefreshIcon />
                </IconButton>
                <IconButton 
                  color="inherit" 
                  onClick={handleClose} 
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
          
          {unreadCount > 0 && (
            <Box sx={{ px: 2, pb: 1 }}>
              <Button 
                size="small" 
                onClick={handleMarkAllAsRead}
                startIcon={<DoneAllIcon />}
                variant="outlined"
                color="inherit"
                fullWidth
              >
                Mark all as read
              </Button>
            </Box>
          )}
        </AppBar>
        
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider'
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
              <CircularProgress />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ 
              p: 3, 
              textAlign: 'center', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: 200
            }}>
              <NotificationsOffIcon color="disabled" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                No notifications to display
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <NotificationItem 
                    notification={notification} 
                    onRead={handleNotificationRead}
                    onDelete={handleDeleteNotification}
                  />
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default NotificationPanel; 