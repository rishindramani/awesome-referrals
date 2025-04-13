import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Container maxWidth="md">
      <Paper 
        elevation={0} 
        sx={{ 
          p: 6, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 4,
          backgroundColor: 'rgba(25, 118, 210, 0.05)',
          mt: 4
        }}
      >
        <Typography 
          variant="h1" 
          component="h1" 
          color="primary"
          sx={{ 
            fontWeight: 'bold', 
            fontSize: '6rem',
            mb: 2
          }}
        >
          404
        </Typography>
        
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          fontWeight="bold"
          textAlign="center"
        >
          Page Not Found
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          paragraph
          textAlign="center"
          sx={{ maxWidth: 500, mb: 4 }}
        >
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<HomeIcon />}
          component={RouterLink}
          to="/"
          sx={{ borderRadius: 2, px: 4, py: 1.5 }}
        >
          Back to Home
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFound; 