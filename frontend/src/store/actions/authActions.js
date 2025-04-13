import axios from 'axios';
import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT,
  REGISTER_START,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  UPDATE_PROFILE_START,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL
} from './actionTypes';
import { setAlert } from './uiActions';

// API Base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Setup axios config with token
const setupConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
};

// Login user
export const login = (email, password) => async (dispatch) => {
  dispatch({ type: AUTH_START });

  try {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    
    // Store token in localStorage
    localStorage.setItem('token', res.data.token);
    
    dispatch({
      type: AUTH_SUCCESS,
      payload: res.data
    });
    
    dispatch(setAlert('Login successful', 'success'));
  } catch (err) {
    const errorMessage = err.response && err.response.data.message
      ? err.response.data.message
      : 'Login failed. Please check your credentials.';
    
    dispatch({
      type: AUTH_FAIL,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Register user
export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_START });

  try {
    const res = await axios.post(`${API_URL}/auth/register`, userData);
    
    // Store token in localStorage
    localStorage.setItem('token', res.data.token);
    
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    
    dispatch(setAlert('Registration successful', 'success'));
  } catch (err) {
    const errorMessage = err.response && err.response.data.message
      ? err.response.data.message
      : 'Registration failed. Please try again.';
    
    dispatch({
      type: REGISTER_FAIL,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Logout user
export const logout = () => (dispatch) => {
  dispatch({ type: AUTH_LOGOUT });
  dispatch(setAlert('Logged out successfully', 'success'));
};

// Get current user
export const checkAuth = () => async (dispatch) => {
  if (!localStorage.getItem('token')) {
    dispatch({ type: AUTH_FAIL });
    return;
  }

  dispatch({ type: AUTH_START });

  try {
    const res = await axios.get(`${API_URL}/auth/me`, setupConfig());
    
    dispatch({
      type: AUTH_SUCCESS,
      payload: {
        token: localStorage.getItem('token'),
        user: res.data.data.user
      }
    });
  } catch (err) {
    dispatch({ type: AUTH_FAIL });
    localStorage.removeItem('token');
  }
};

// Update user profile
export const updateProfile = (profileData) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_START });

  try {
    const res = await axios.patch(
      `${API_URL}/users/profile`,
      profileData,
      setupConfig()
    );
    
    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: res.data.data.user
    });
    
    dispatch(setAlert('Profile updated successfully', 'success'));
  } catch (err) {
    const errorMessage = err.response && err.response.data.message
      ? err.response.data.message
      : 'Profile update failed. Please try again.';
    
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Update user password
export const updatePassword = (passwordData) => async (dispatch) => {
  dispatch({ type: AUTH_START });

  try {
    const res = await axios.patch(
      `${API_URL}/auth/updatepassword`,
      passwordData,
      setupConfig()
    );
    
    // Update token in localStorage
    localStorage.setItem('token', res.data.token);
    
    dispatch({
      type: AUTH_SUCCESS,
      payload: res.data
    });
    
    dispatch(setAlert('Password updated successfully', 'success'));
  } catch (err) {
    const errorMessage = err.response && err.response.data.message
      ? err.response.data.message
      : 'Password update failed. Please try again.';
    
    dispatch({
      type: AUTH_FAIL,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
}; 