import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';

// Components
import MainLayout from './components/layouts/MainLayout';
import { ErrorBoundary, LoadingFallback, PrivateRoute, AlertContainer } from './components/common';
import { useAuthContext } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JobSearch from './pages/JobSearch';
import JobDetail from './pages/JobDetail';
import Profile from './pages/Profile';
import ReferralRequests from './pages/ReferralRequests';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import Conversations from './pages/Conversations';
import ChatPage from './pages/ChatPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import NotFound from './pages/NotFound';
import CreateReferralRequest from './pages/CreateReferralRequest';
import LinkedInCallback from './pages/LinkedInCallback';

// Helper component to preserve query parameters when redirecting
const RedirectWithState = ({ to }) => {
  const location = useLocation();
  return <Navigate to={to} state={{ from: location }} replace />;
};

const App = () => {
  const { isAuthenticated, loading, authTimeout } = useAuthContext();
  const location = useLocation();

  // Function to reset application state
  const handleReset = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Navigate to login page
  };

  // Function to retry loading
  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    // Show reset option if loading is taking too long (authTimeout flag is set)
    if (authTimeout) {
      return (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="100vh"
          p={3}
          textAlign="center"
        >
          <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Loading is taking longer than expected
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 500, mb: 3 }}>
            There might be an issue with authentication. You can wait a bit longer, retry, or reset the application to start fresh.
          </Typography>
          <Box display="flex" gap={2}>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={handleRetry}
            >
              Retry
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleReset}
            >
              Reset Application
            </Button>
          </Box>
        </Box>
      );
    }
    
    return <LoadingFallback height={600} message="Loading application..." />;
  }

  return (
    <ErrorBoundary>
      <AlertContainer />
      <Routes>
        {/* Moved NotFound route outside MainLayout */}
        <Route path="*" element={<NotFound />} />
        
        {/* LinkedIn callback route - outside of MainLayout */}
        <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
        
        {/* Public routes inside MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route 
            path="login" 
            element={!isAuthenticated ? <Login /> : <RedirectWithState to="/dashboard" />} 
          />
          <Route 
            path="register" 
            element={!isAuthenticated ? <Register /> : <RedirectWithState to="/dashboard" />} 
          />
          
          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="jobs" element={<JobSearch />} />
            <Route path="jobs/:id" element={<JobDetail />} />
            <Route path="companies" element={<Companies />} />
            <Route path="companies/:id" element={<CompanyDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="referrals" element={<ReferralRequests />} />
            <Route path="referrals/new/:jobId/:referrerId" element={<CreateReferralRequest />} />
            <Route path="messages" element={<ChatPage />} />
            <Route path="messages/:conversationId" element={<ChatPage />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
          </Route>
          
          {/* Note: '*' route is now handled outside this MainLayout block */}
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};

export default App; 