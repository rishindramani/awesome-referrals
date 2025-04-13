import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';

// Components
import MainLayout from './components/layouts/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JobSearch from './pages/JobSearch';
import JobDetail from './pages/JobDetail';
import Profile from './pages/Profile';
import ReferralRequests from './pages/ReferralRequests';
import NotFound from './pages/NotFound';

// Redux actions
import { checkAuth } from './store/actions/authActions';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        
        {/* Protected routes */}
        <Route path="dashboard" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="jobs" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <JobSearch />
          </ProtectedRoute>
        } />
        <Route path="jobs/:id" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <JobDetail />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="referrals" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ReferralRequests />
          </ProtectedRoute>
        } />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App; 