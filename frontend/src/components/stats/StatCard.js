import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme, trend }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8]
  },
  borderLeft: trend === 'up' 
    ? `4px solid ${theme.palette.success.main}` 
    : trend === 'down' 
      ? `4px solid ${theme.palette.error.main}` 
      : 'none'
}));

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary', 
  trend, 
  trendValue, 
  loading = false, 
  footer,
  formatValue = (v) => v
}) => {
  return (
    <StyledCard variant="outlined" trend={trend}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle2" color="textSecondary">
            {title}
          </Typography>
          {icon && (
            <Box 
              sx={{ 
                backgroundColor: `${color}.lighter`,
                color: `${color}.main`,
                p: 1,
                borderRadius: 1,
                display: 'flex'
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
        
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" my={2}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Box mt={1}>
            <Typography variant="h4" component="div" fontWeight="500">
              {formatValue(value)}
            </Typography>
            
            {trend && trendValue && (
              <Typography 
                variant="body2" 
                color={trend === 'up' ? 'success.main' : 'error.main'}
                sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
              >
                {trend === 'up' ? '↑' : '↓'} {trendValue}
                {typeof trendValue === 'number' && '%'}
              </Typography>
            )}
          </Box>
        )}
        
        {footer && (
          <Box mt="auto" pt={1}>
            <Typography variant="caption" color="textSecondary">
              {footer}
            </Typography>
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default StatCard; 