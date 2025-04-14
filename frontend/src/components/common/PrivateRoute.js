import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuthContext } from '../../context/AuthContext';
import LoadingFallback from './LoadingFallback';

const PrivateRoute = ({ 
  component: Component, 
  redirectPath = '/login',
  children
}) => {
  const { isAuthenticated, loading } = useAuthContext();
  
  if (loading) {
    return <LoadingFallback />;
  }
  
  if (!isAuthenticated) {
    // Redirect them to the login page with a return to path
    return <Navigate to={redirectPath} state={{ from: window.location.pathname }} replace />;
  }

  // If there's a component prop, render it, otherwise render children or Outlet
  return Component ? <Component /> : children || <Outlet />;
};

PrivateRoute.propTypes = {
  component: PropTypes.elementType,
  redirectPath: PropTypes.string,
  children: PropTypes.node
};

export default PrivateRoute; 