import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Badge,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Notifications as NotificationIcon,
  Email as EmailIcon,
  Assignment as AssignmentIcon,
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon,
  CancelOutlined as CancelIcon,
  DoneAll as DoneAllIcon
} from '@mui/icons-material';
import { 
  fetchNotifications, 
  markNotificationRead, 
  markAllNotificationsRead 
} from '../../store/actions/notificationActions';
import { toggleNotificationPanel } from '../../store/actions/uiActions';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'referral_request':
      return <AssignmentIcon color="primary" />;
    case 'referral_accepted':
      return <CheckCircleIcon color="success" />;
    case 'referral_rejected':
      return <CancelIcon color="error" />;
    case 'job_match':
      return <WorkIcon color="info" />;
    case 'message':
      return <EmailIcon color="secondary" />;
    default:
      return <NotificationIcon color="action" />;
  }
};

const formatNotificationTime = (dateString) => {
  const notificationDate = new Date(dateString);
  const now = new Date();
  const diffInMilliseconds = now - notificationDate;
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  } else {
    return notificationDate.toLocaleDateString();
  }
};

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

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      dispatch(markNotificationRead(notification.id));
    }
    // Add navigation logic based on notification type
    // e.g., navigate to referral detail, job detail, etc.
    handleClose();
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsRead());
  };

  return (
    <Drawer
      anchor="right"
      open={isNotificationPanelOpen}
      onClose={handleClose}
    >
      <Box sx={{ width: { xs: '100vw', sm: 350 }, p: 0 }}>
        <Box sx={{ 
          p: 2, 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box display="flex" alignItems="center">
            <Badge badgeContent={unreadCount} color="error">
              <NotificationIcon />
            </Badge>
            <Typography variant="h6" sx={{ ml: 1 }}>
              Notifications
            </Typography>
          </Box>
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={handleClose} 
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        {unreadCount > 0 && (
          <Box sx={{ p: 1, bgcolor: 'background.default', textAlign: 'center' }}>
            <Button 
              size="small" 
              onClick={handleMarkAllAsRead}
              startIcon={<DoneAllIcon />}
            >
              Mark all as read
            </Button>
          </Box>
        )}
        
        <Divider />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No notifications to display
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem 
                  button 
                  onClick={() => handleNotificationClick(notification)}
                  sx={{ 
                    bgcolor: notification.isRead ? 'inherit' : 'action.hover',
                    py: 1.5
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: notification.isRead ? 'normal' : 'bold',
                          mb: 0.5
                        }}
                      >
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatNotificationTime(notification.createdAt)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default NotificationPanel; 