import React from 'react';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  '& .MuiToggleButton-root': {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
    margin: theme.spacing(0, 0.5),
    padding: theme.spacing(1, 2),
    '&:first-of-type': {
      marginLeft: 0
    },
    '&:last-of-type': {
      marginRight: 0
    }
  }
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

const TimePeriodSelector = ({ 
  value = 'all', 
  onChange, 
  label = 'Filter by period',
  showLabel = true,
  size = 'small',
  orientation = 'horizontal'
}) => {
  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <Box 
      display="flex" 
      alignItems="center" 
      gap={2}
      flexDirection={orientation === 'vertical' ? 'column' : 'row'}
    >
      {showLabel && label && (
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
          {label}:
        </Typography>
      )}
      <StyledToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        size={size}
        orientation={orientation}
        aria-label="time period filter"
      >
        {periods.map((period) => (
          <StyledToggleButton 
            key={period.value}
            value={period.value} 
            aria-label={period.label}
          >
            {period.label}
          </StyledToggleButton>
        ))}
      </StyledToggleButtonGroup>
    </Box>
  );
};

export default TimePeriodSelector;