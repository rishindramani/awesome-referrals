import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Slide } from '@mui/material';

const AlertMessage = ({ alert }) => {
  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <Alert 
        severity={alert.type} 
        sx={{ 
          mb: 2, 
          width: '100%', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
        }}
      >
        {alert.message}
      </Alert>
    </Slide>
  );
};

AlertMessage.propTypes = {
  alert: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
  }).isRequired
};

export default AlertMessage; 