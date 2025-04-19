import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box, Typography, CircularProgress, Container, Paper } from '@mui/material';
import { setAlert } from '../store/actions/uiActions';
import { checkAuth } from '../store/actions/authActions';

const LinkedInCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get token from URL query parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (!token) {
          setError('No authentication token received from LinkedIn');
          dispatch(setAlert('LinkedIn authentication failed', 'error'));
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Store token in localStorage
        localStorage.setItem('token', token);
        
        // Load user information
        dispatch(checkAuth());
        
        // Show success message and redirect to dashboard
        dispatch(setAlert('Successfully authenticated with LinkedIn', 'success'));
        navigate('/dashboard');
      } catch (err) {
        console.error('LinkedIn callback error:', err);
        setError('An error occurred during LinkedIn authentication');
        dispatch(setAlert('LinkedIn authentication failed', 'error'));
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    processCallback();
  }, [dispatch, location.search, navigate]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        {error ? (
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <CircularProgress />
            </Box>
            <Typography variant="h6" gutterBottom>
              Processing LinkedIn Authentication
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please wait while we complete your LinkedIn authentication...
            </Typography>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default LinkedInCallback; 