import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme, trend }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  borderRadius: theme.spacing(2),
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8]
  },
  borderLeft: trend === 'up' 
    ? `4px solid ${theme.palette.success.main}` 
    : trend === 'down' 
      ? `4px solid ${theme.palette.error.main}` 
      : trend === 'neutral'
        ? `4px solid ${theme.palette.info.main}`
        : 'none'
}));

const TrendChip = styled(Chip)(({ theme, trend }) => ({
  color: trend === 'up' 
    ? theme.palette.success.main 
    : trend === 'down' 
      ? theme.palette.error.main 
      : theme.palette.info.main,
  backgroundColor: trend === 'up' 
    ? theme.palette.success.lighter 
    : trend === 'down' 
      ? theme.palette.error.lighter 
      : theme.palette.info.lighter,
  fontSize: '0.75rem',
  height: 24
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
  formatValue = (v) => v,
  subtitle,
  onClick
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp fontSize="small" />;
      case 'down':
        return <TrendingDown fontSize="small" />;
      case 'neutral':
        return <TrendingFlat fontSize="small" />;
      default:
        return null;
    }
  };

  const getTrendText = () => {
    if (!trend || !trendValue) return '';
    const sign = trend === 'up' ? '+' : trend === 'down' ? '-' : '';
    return `${sign}${trendValue}%`;
  };

  return (
    <StyledCard 
      variant="outlined" 
      trend={trend}
      onClick={onClick}
      sx={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box flex={1}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box 
              sx={{ 
                backgroundColor: `${color}.lighter`,
                color: `${color}.main`,
                p: 1.5,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
        
        {/* Value */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" my={2}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Box mb={1}>
            <Typography 
              variant="h3" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.75rem', sm: '2.125rem' },
                lineHeight: 1.2
              }}
            >
              {formatValue(value)}
            </Typography>
          </Box>
        )}

        {/* Trend */}
        {trend && trendValue && !loading && (
          <Box mb={1}>
            <TrendChip
              icon={getTrendIcon()}
              label={getTrendText()}
              size="small"
              trend={trend}
            />
          </Box>
        )}

        {/* Footer */}
        {footer && !loading && (
          <Box mt="auto">
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
              {footer}
            </Typography>
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default StatCard;