import axios from 'axios';
import {
  STATS_LOADING,
  STATS_SUCCESS,
  STATS_ERROR,
  USER_STATS_LOADING,
  USER_STATS_SUCCESS,
  USER_STATS_ERROR
} from './actionTypes';
import { setAlert, setLoading, clearLoading } from './uiActions';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get overall platform statistics
export const getPlatformStats = () => async (dispatch, getState) => {
  try {
    dispatch({ type: STATS_LOADING });
    
    const { token } = getState().auth;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const res = await axios.get(`${API_URL}/stats/platform`, config);
    
    dispatch({
      type: STATS_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = err.response?.data.message || 'Failed to fetch platform statistics';
    dispatch({ type: STATS_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Get user's personal referral statistics
export const getUserStats = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_STATS_LOADING });
    
    const { token } = getState().auth;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const res = await axios.get(`${API_URL}/stats/user`, config);
    
    dispatch({
      type: USER_STATS_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = err.response?.data.message || 'Failed to fetch user statistics';
    dispatch({ type: USER_STATS_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Get company referral statistics
export const getCompanyStats = (companyId) => async (dispatch, getState) => {
  try {
    dispatch(setLoading());
    
    const { token } = getState().auth;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const res = await axios.get(`${API_URL}/stats/company/${companyId}`, config);
    
    // Use the general stats success type but specify company in the payload
    dispatch({
      type: STATS_SUCCESS,
      payload: {
        ...res.data,
        statsType: 'company'
      }
    });
    
    dispatch(clearLoading());
  } catch (err) {
    const errorMessage = err.response?.data.message || 'Failed to fetch company statistics';
    dispatch({ type: STATS_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
    dispatch(clearLoading());
  }
};

// Get job category statistics (for data visualization)
export const getJobCategoryStats = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading());
    
    const { token } = getState().auth;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const res = await axios.get(`${API_URL}/stats/job-categories`, config);
    
    // Use the general stats success type but specify job categories in the payload
    dispatch({
      type: STATS_SUCCESS,
      payload: {
        ...res.data,
        statsType: 'jobCategories'
      }
    });
    
    dispatch(clearLoading());
  } catch (err) {
    const errorMessage = err.response?.data.message || 'Failed to fetch job category statistics';
    dispatch({ type: STATS_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
    dispatch(clearLoading());
  }
}; 