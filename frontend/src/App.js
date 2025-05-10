import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

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
import NotFound from './pages/NotFound';

// Helper component to preserve query parameters when redirecting
const RedirectWithState = ({ to }) => {
  const location = useLocation();
  return <Navigate to={to} state={{ from: location }} replace />;
};

const App = () => {
  const { isAuthenticated, loading } = useAuthContext();
  const location = useLocation();
  const [loadingTimer, setLoadingTimer] = useState(0);

  // Add a timer to detect if loading is taking too long
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => {
        setLoadingTimer(prev => prev + 1);
      }, 1000);
    } else {
      setLoadingTimer(0);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading]);

  // Function to reset application state
  const handleReset = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  if (loading) {
    // Show reset option if loading takes more than 5 seconds
    if (loadingTimer > 5) {
      return (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="100vh"
          p={3}
        >
          <Typography variant="h5" gutterBottom>
            Loading is taking longer than expected
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            There might be an issue with authentication. Would you like to reset the application?
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleReset}
          >
            Reset Application
          </Button>
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
            <Route path="messages" element={<Conversations />} />
          </Route>
          
          {/* Note: '*' route is now handled outside this MainLayout block */}
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};

export default App; 