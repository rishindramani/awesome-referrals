import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  login, 
  register, 
  logout, 
  updateProfile, 
  updatePassword 
} from '../store/actions/authActions';
import { setAlert } from '../store/actions/uiActions';
import apiService from '../services/apiService';

/**
 * Custom hook for authentication operations
 * @returns {Object} Authentication state and methods
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);
  const { isAuthenticated, user, loading, error } = auth;
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  /**
   * Login user
   * @param {Object} credentials - User credentials (email, password)
   * @param {string} redirectTo - Path to redirect to after successful login
   * @returns {Promise<Object>} - User data
   */
  const loginUser = useCallback(async (credentials, redirectTo = '/dashboard') => {
    try {
      const response = await apiService.auth.login(credentials);
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      setToken(token);
      
      // Dispatch login success action
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token, user }
      });
      
      dispatch(setAlert('Login successful!', 'success'));
      if (redirectTo) navigate(redirectTo);
      return user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      
      // Dispatch login failure action
      dispatch({
        type: 'LOGIN_FAIL',
        payload: errorMessage
      });
      
      dispatch(setAlert(errorMessage, 'error'));
      throw err;
    }
  }, [dispatch, navigate]);
  
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} redirectTo - Path to redirect to after successful registration
   * @returns {Promise<Object>} - User data
   */
  const registerUser = useCallback(async (userData, redirectTo = '/dashboard') => {
    try {
      const response = await apiService.auth.register(userData);
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      setToken(token);
      
      // Dispatch register success action
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: { token, user }
      });
      
      dispatch(setAlert('Registration successful!', 'success'));
      if (redirectTo) navigate(redirectTo);
      return user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      
      // Dispatch register failure action
      dispatch({
        type: 'REGISTER_FAIL',
        payload: errorMessage
      });
      
      dispatch(setAlert(errorMessage, 'error'));
      throw err;
    }
  }, [dispatch, navigate]);
  
  /**
   * Logout user
   * @param {string} redirectTo - Path to redirect to after logout
   */
  const logoutUser = useCallback((redirectTo = '/login') => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    setToken(null);
    
    // Dispatch logout action
    dispatch({ type: 'LOGOUT' });
    dispatch(setAlert('You have been logged out', 'info'));
    if (redirectTo) navigate(redirectTo);
  }, [dispatch, navigate]);
  
  /**
   * Request password reset
   * @param {string} email - User email
   */
  const requestPasswordReset = useCallback(async (email) => {
    try {
      await apiService.auth.resetPasswordRequest(email);
      dispatch(setAlert('Password reset instructions sent to your email', 'success'));
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to request password reset. Please try again.';
      dispatch(setAlert(errorMessage, 'error'));
      throw err;
    }
  }, [dispatch]);
  
  /**
   * Reset password with token
   * @param {Object} resetData - Password reset data (token, newPassword)
   */
  const resetPassword = useCallback(async (resetData) => {
    try {
      await apiService.auth.resetPassword(resetData);
      dispatch(setAlert('Password has been reset successfully', 'success'));
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password. Please try again.';
      dispatch(setAlert(errorMessage, 'error'));
      throw err;
    }
  }, [dispatch]);
  
  /**
   * Load user profile
   */
  const loadUser = useCallback(async () => {
    // If no token, don't attempt to load user
    if (!token) {
      dispatch({ type: 'AUTH_ERROR' });
      return;
    }
    
    try {
      dispatch({ type: 'USER_LOADING' });
      const response = await apiService.auth.getUser();
      
      dispatch({
        type: 'USER_LOADED',
        payload: response.data
      });
    } catch (err) {
      // If error is 401, clear token
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setToken(null);
      }
      
      dispatch({ type: 'AUTH_ERROR' });
    }
  }, [token, dispatch]);
  
  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   */
  const updateUserProfile = useCallback((profileData) => {
    dispatch(updateProfile(profileData))
      .then(() => {
        dispatch(setAlert('Profile updated successfully', 'success'));
      })
      .catch(err => {
        console.error('Profile update error:', err);
      });
  }, [dispatch]);

  /**
   * Update user password
   * @param {Object} passwordData - New and current password
   */
  const updateUserPassword = useCallback((passwordData) => {
    dispatch(updatePassword(passwordData))
      .then(() => {
        dispatch(setAlert('Password updated successfully', 'success'));
      })
      .catch(err => {
        console.error('Password update error:', err);
      });
  }, [dispatch]);
  
  // Check token and load user when token changes
  useEffect(() => {
    loadUser();
  }, [token, loadUser]);
  
  /**
   * Check if user has specific permission/role
   * @param {string} role - Role to check
   * @returns {boolean} - Whether user has the role
   */
  const hasRole = useCallback((role) => {
    if (!user) return false;
    return user.role === role || user.roles?.includes(role);
  }, [user]);

  return {
    isAuthenticated,
    user,
    loading,
    error,
    loginUser,
    registerUser,
    logoutUser,
    requestPasswordReset,
    resetPassword,
    loadUser,
    updateUserProfile,
    updateUserPassword,
    hasRole
  };
};

export default useAuth; 