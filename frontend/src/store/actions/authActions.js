import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT,
  REGISTER_START,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  SET_ALERT
} from './actionTypes';
import api from '../../services/apiService';

// Login user
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_START });

    const res = await api.post('/auth/login', { email, password });

    // Store token in localStorage
    localStorage.setItem('token', res.data.token);

    dispatch({
      type: AUTH_SUCCESS,
      payload: res.data
    });

    dispatch({
      type: SET_ALERT,
      payload: {
        id: new Date().getTime(),
        type: 'success',
        message: 'Login successful!'
      }
    });
  } catch (err) {
    dispatch({
      type: AUTH_FAIL,
      payload: err.response?.data?.message || 'Login failed. Please check your credentials.'
    });

    dispatch({
      type: SET_ALERT,
      payload: {
        id: new Date().getTime(),
        type: 'error',
        message: err.response?.data?.message || 'Login failed. Please check your credentials.'
      }
    });
  }
};

// Register user
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_START });

    const res = await api.post('/auth/register', userData);

    // Store token in localStorage
    localStorage.setItem('token', res.data.token);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    dispatch({
      type: SET_ALERT,
      payload: {
        id: new Date().getTime(),
        type: 'success',
        message: 'Registration successful!'
      }
    });
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
      payload: err.response?.data?.message || 'Registration failed. Please try again.'
    });

    dispatch({
      type: SET_ALERT,
      payload: {
        id: new Date().getTime(),
        type: 'error',
        message: err.response?.data?.message || 'Registration failed. Please try again.'
      }
    });
  }
};

// Logout user
export const logout = () => (dispatch) => {
  // Remove token from localStorage
  localStorage.removeItem('token');

  dispatch({ type: AUTH_LOGOUT });

  dispatch({
    type: SET_ALERT,
    payload: {
      id: new Date().getTime(),
      type: 'success',
      message: 'Logged out successfully!'
    }
  });
};

// Check if user is authenticated
export const checkAuth = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      dispatch({ type: AUTH_LOGOUT });
      return;
    }

    dispatch({ type: AUTH_START });

    const res = await api.get('/auth/me');

    dispatch({
      type: AUTH_SUCCESS,
      payload: { user: res.data, token }
    });
  } catch (err) {
    // If token is invalid, remove it
    localStorage.removeItem('token');
    dispatch({ type: AUTH_LOGOUT });
  }
};

// Update user profile
export const updateProfile = (profileData) => async (dispatch) => {
  try {
    const res = await api.put('/users/me/profile', profileData);

    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: res.data
    });

    dispatch({
      type: SET_ALERT,
      payload: {
        id: new Date().getTime(),
        type: 'success',
        message: 'Profile updated successfully!'
      }
    });
  } catch (err) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: err.response?.data?.message || 'Failed to update profile'
    });

    dispatch({
      type: SET_ALERT,
      payload: {
        id: new Date().getTime(),
        type: 'error',
        message: err.response?.data?.message || 'Failed to update profile'
      }
    });
  }
};

// Update user password
export const updatePassword = (oldPassword, newPassword) => async (dispatch) => {
  try {
    await api.put('/users/me/password', { oldPassword, newPassword });

    dispatch({
      type: SET_ALERT,
      payload: {
        id: new Date().getTime(),
        type: 'success',
        message: 'Password updated successfully!'
      }
    });
  } catch (err) {
    dispatch({
      type: SET_ALERT,
      payload: {
        id: new Date().getTime(),
        type: 'error',
        message: err.response?.data?.message || 'Failed to update password'
      }
    });
  }
}; 