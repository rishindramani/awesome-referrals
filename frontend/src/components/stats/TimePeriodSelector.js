import React from 'react';
import { ToggleButtonGroup, ToggleButton, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  textTransform: 'none',
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  }
}));

const TimePeriodSelector = ({ value, onChange, label = 'Filter by period' }) => {
  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      {label && (
        <Typography variant="body2" color="textSecondary">
          {label}:
        </Typography>
      )}
      <StyledToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        size="small"
        aria-label="time period"
      >
        <StyledToggleButton value="week" aria-label="This week">
          Week
        </StyledToggleButton>
        <StyledToggleButton value="month" aria-label="This month">
          Month
        </StyledToggleButton>
        <StyledToggleButton value="year" aria-label="This year">
          Year
        </StyledToggleButton>
        <StyledToggleButton value="all" aria-label="All time">
          All time
        </StyledToggleButton>
      </StyledToggleButtonGroup>
    </Box>
  );
};

export default TimePeriodSelector; 