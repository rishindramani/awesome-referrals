import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT,
  REGISTER_START,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_ERROR
} from './actionTypes';
import { setAlert } from './uiActions';
import api from '../../services/apiService';

// Login user
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_START });
    
    const res = await api.post('/auth/login', { email, password });
    
    localStorage.setItem('token', res.data.token);
    dispatch({
      type: AUTH_SUCCESS,
      payload: res.data.user
    });
    dispatch(setAlert('Login successful', 'success'));
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Login failed';
    dispatch({ type: AUTH_FAIL, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Register user
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_START });
    
    const res = await api.post('/auth/register', userData);
    
    localStorage.setItem('token', res.data.token);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data.user
    });
    dispatch(setAlert('Registration successful', 'success'));
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Registration failed';
    dispatch({ type: REGISTER_FAIL, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Logout user
export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch({ type: AUTH_LOGOUT });
  dispatch(setAlert('Logged out successfully', 'success'));
};

// Check authentication status
export const checkAuth = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  if (!token) {
    dispatch({ type: AUTH_FAIL });
    return;
  }

  try {
    dispatch({ type: AUTH_START });
    
    const res = await api.get('/auth/me');
    
    dispatch({
      type: AUTH_SUCCESS,
      payload: res.data.user
    });
  } catch (err) {
    localStorage.removeItem('token');
    dispatch({ type: AUTH_FAIL });
  }
};

// Update user profile
export const updateProfile = (profileData) => async (dispatch) => {
  try {
    const res = await api.put('/auth/profile', profileData);
    
    dispatch({
      type: PROFILE_UPDATE_SUCCESS,
      payload: res.data.user
    });
    dispatch(setAlert('Profile updated successfully', 'success'));
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to update profile';
    dispatch({ type: PROFILE_UPDATE_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Update password
export const updatePassword = (passwordData) => async (dispatch) => {
  try {
    const res = await api.put('/auth/password', passwordData);
    
    localStorage.setItem('token', res.data.token);
    dispatch(setAlert('Password updated successfully', 'success'));
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to update password';
    dispatch(setAlert(errorMessage, 'error'));
  }
}; 