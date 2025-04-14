import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Components
import MainLayout from './components/layouts/MainLayout';
import { ProtectedRoute, ErrorBoundary, LoadingFallback } from './components/common';

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
    return <LoadingFallback height={600} message="Loading application..." />;
  }

  return (
    <ErrorBoundary>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={
            <ErrorBoundary>
              <Home />
            </ErrorBoundary>
          } />
          <Route path="login" element={!isAuthenticated ? 
            <ErrorBoundary>
              <Login />
            </ErrorBoundary> : <Navigate to="/dashboard" />
          } />
          <Route path="register" element={!isAuthenticated ? 
            <ErrorBoundary>
              <Register />
            </ErrorBoundary> : <Navigate to="/dashboard" />
          } />
          
          {/* Protected routes */}
          <Route path="dashboard" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="jobs" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ErrorBoundary>
                <JobSearch />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="jobs/:id" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ErrorBoundary>
                <JobDetail />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="companies" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ErrorBoundary>
                <Companies />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="companies/:id" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ErrorBoundary>
                <CompanyDetail />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ErrorBoundary>
                <Profile />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="referrals" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ErrorBoundary>
                <ReferralRequests />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          
          {/* 404 route */}
          <Route path="*" element={
            <ErrorBoundary>
              <NotFound />
            </ErrorBoundary>
          } />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};

export default App; 