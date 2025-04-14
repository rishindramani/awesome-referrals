import React from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import AlertMessage from './AlertMessage';

const AlertContainer = () => {
  const alerts = useSelector(state => state.ui.alerts);

  if (alerts.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        maxWidth: '400px'
      }}
    >
      {alerts.map(alert => (
        <AlertMessage key={alert.id} alert={alert} />
      ))}
    </Box>
  );
};

export default AlertContainer; 