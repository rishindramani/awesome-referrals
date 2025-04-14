import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  CircularProgress,
  Skeleton,
  Typography,
  Paper
} from '@mui/material';

const LoadingFallback = ({ 
  variant = 'spinner', 
  message = 'Loading...', 
  height = 400,
  skeletonType = 'text',
  skeletonCount = 3
}) => {
  
  // Spinner loading indicator
  if (variant === 'spinner') {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight={height}
        width="100%"
      >
        <CircularProgress color="primary" />
        {message && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            {message}
          </Typography>
        )}
      </Box>
    );
  }
  
  // Skeleton loading indicator
  if (variant === 'skeleton') {
    return (
      <Box sx={{ width: '100%', minHeight: 100 }}>
        {skeletonType === 'card' ? (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Skeleton variant="rectangular" width="30%" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={118} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="60%" height={20} />
          </Paper>
        ) : (
          Array(skeletonCount).fill().map((_, index) => (
            <Skeleton
              key={index}
              variant={skeletonType}
              width={index % 2 === 0 ? '100%' : '80%'}
              height={skeletonType === 'rectangular' ? 100 : 30}
              sx={{ my: 1 }}
            />
          ))
        )}
      </Box>
    );
  }
  
  // List item skeleton loading
  if (variant === 'list') {
    return (
      <Box sx={{ width: '100%' }}>
        {Array(skeletonCount).fill().map((_, index) => (
          <Box key={index} sx={{ display: 'flex', py: 1.5, alignItems: 'center' }}>
            {/* Avatar */}
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            
            {/* Content */}
            <Box sx={{ width: '100%' }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={18} />
            </Box>
            
            {/* Action */}
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
        ))}
      </Box>
    );
  }
  
  // Grid skeleton loading
  if (variant === 'grid') {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {Array(skeletonCount).fill().map((_, index) => (
          <Box key={index} sx={{ width: 'calc(33.33% - 16px)', minWidth: 200 }}>
            <Skeleton variant="rectangular" width="100%" height={140} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="70%" height={24} />
            <Skeleton variant="text" width="40%" height={18} />
          </Box>
        ))}
      </Box>
    );
  }
  
  // Default fallback
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={height}
      width="100%"
    >
      <CircularProgress color="primary" />
    </Box>
  );
};

LoadingFallback.propTypes = {
  variant: PropTypes.oneOf(['spinner', 'skeleton', 'list', 'grid']),
  message: PropTypes.string,
  height: PropTypes.number,
  skeletonType: PropTypes.oneOf(['text', 'rectangular', 'circular', 'card']),
  skeletonCount: PropTypes.number
};

export default LoadingFallback; 