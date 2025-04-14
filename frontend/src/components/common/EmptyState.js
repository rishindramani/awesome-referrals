import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  Paper
} from '@mui/material';
import {
  Inbox as InboxIcon,
  Search as SearchIcon,
  ErrorOutline as ErrorIcon,
  Add as AddIcon
} from '@mui/icons-material';

const EmptyState = ({
  type = 'default',
  title = 'No data available',
  message = 'There are no items to display at this time.',
  actionText,
  actionIcon,
  onAction,
  icon: CustomIcon,
  paperProps = {},
  boxProps = {}
}) => {
  let IconComponent;
  
  switch (type) {
    case 'search':
      IconComponent = SearchIcon;
      title = title || 'No search results';
      message = message || 'Try adjusting your search or filter criteria.';
      break;
    case 'error':
      IconComponent = ErrorIcon;
      title = title || 'Unable to load data';
      message = message || 'There was a problem loading this content. Please try again.';
      break;
    case 'empty':
      IconComponent = InboxIcon;
      title = title || 'Nothing here yet';
      message = message || 'Get started by creating your first item.';
      actionText = actionText || 'Create New';
      actionIcon = actionIcon || <AddIcon />;
      break;
    default:
      IconComponent = CustomIcon || InboxIcon;
  }
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 2,
        textAlign: 'center',
        border: '1px dashed rgba(0, 0, 0, 0.12)',
        backgroundColor: 'background.default',
        ...paperProps
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 3,
          ...boxProps
        }}
      >
        {IconComponent && (
          <IconComponent
            sx={{
              fontSize: 64,
              color: 'text.secondary',
              opacity: 0.6,
              mb: 2
            }}
          />
        )}
        
        <Typography variant="h6" component="h3" gutterBottom>
          {title}
        </Typography>
        
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 400, mb: 3 }}
        >
          {message}
        </Typography>
        
        {actionText && onAction && (
          <Button
            variant="contained"
            color="primary"
            startIcon={actionIcon}
            onClick={onAction}
          >
            {actionText}
          </Button>
        )}
      </Box>
    </Paper>
  );
};

EmptyState.propTypes = {
  type: PropTypes.oneOf(['default', 'search', 'error', 'empty']),
  title: PropTypes.string,
  message: PropTypes.string,
  actionText: PropTypes.string,
  actionIcon: PropTypes.node,
  onAction: PropTypes.func,
  icon: PropTypes.elementType,
  paperProps: PropTypes.object,
  boxProps: PropTypes.object
};

export default EmptyState; 