import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  IconButton,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  EmojiEvents as RewardIcon,
  Business as CompanyIcon,
  Event as EventIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'referral_request':
      return <AssignmentIcon />;
    case 'referral_accepted':
      return <CheckCircleIcon color="success" />;
    case 'referral_rejected':
      return <CancelIcon color="error" />;
    case 'interview_scheduled':
      return <EventIcon color="info" />;
    case 'hired':
      return <WorkIcon color="success" />;
    case 'job_match':
      return <WorkIcon color="primary" />;
    case 'message':
      return <EmailIcon color="secondary" />;
    case 'reward':
      return <RewardIcon color="warning" />;
    case 'company':
      return <CompanyIcon color="info" />;
    default:
      return <PersonIcon />;
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case 'referral_request':
      return 'primary.light';
    case 'referral_accepted':
      return 'success.light';
    case 'referral_rejected':
      return 'error.light';
    case 'interview_scheduled':
      return 'info.light';
    case 'hired':
      return 'success.light';
    case 'job_match':
      return 'primary.light';
    case 'message':
      return 'secondary.light';
    case 'reward':
      return 'warning.light';
    default:
      return 'grey.100';
  }
};

const getNotificationRoute = (notification) => {
  const { type, related_entity_id, related_entity_type } = notification;
  
  switch (type) {
    case 'referral_request':
    case 'referral_accepted':
    case 'referral_rejected':
    case 'referral_update':
      return `/referrals/${related_entity_id}`;
    case 'job_match':
      return `/jobs/${related_entity_id}`;
    case 'message':
      return `/messages/${related_entity_id}`;
    case 'interview_scheduled':
      return `/referrals/${related_entity_id}`;
    case 'hired':
      return `/referrals/${related_entity_id}`;
    case 'reward':
      return `/rewards`;
    case 'company':
      return `/companies/${related_entity_id}`;
    default:
      return null;
  }
};

const NotificationItem = ({ notification, onRead, onDelete }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    // Mark as read if not already read
    if (!notification.isRead) {
      onRead(notification.id);
    }
    
    // Navigate to the relevant page
    const route = getNotificationRoute(notification);
    if (route) {
      navigate(route);
    }
  };
  
  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        borderLeft: notification.isRead ? 0 : 3,
        borderColor: notification.isRead ? 'transparent' : 'primary.main',
        bgcolor: notification.isRead ? 'inherit' : 'action.hover',
        py: 1,
        pl: notification.isRead ? 2 : 1
      }}
      secondaryAction={
        <Box>
          <IconButton 
            edge="end" 
            aria-label="delete" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      }
      onClick={handleClick}
      button
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: getNotificationColor(notification.type) }}>
          {getNotificationIcon(notification.type)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="subtitle1"
              fontWeight={notification.isRead ? 'normal' : 'bold'}
            >
              {notification.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </Typography>
          </Box>
        }
        secondary={
          <>
            <Typography
              variant="body2"
              color="text.primary"
              sx={{ 
                mb: 0.5,
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2
              }}
            >
              {notification.message}
            </Typography>
            <Chip 
              label={notification.type.replace('_', ' ')} 
              size="small"
              color={notification.isRead ? "default" : "primary"}
              variant={notification.isRead ? "outlined" : "filled"}
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          </>
        }
      />
    </ListItem>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isRead: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
    related_entity_id: PropTypes.string,
    related_entity_type: PropTypes.string
  }).isRequired,
  onRead: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default NotificationItem; 