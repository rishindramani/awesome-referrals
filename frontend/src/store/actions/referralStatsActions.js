import {
  STATS_LOADING,
  STATS_SUCCESS,
  STATS_ERROR,
  USER_STATS_LOADING,
  USER_STATS_SUCCESS,
  USER_STATS_ERROR
} from './actionTypes';
import { setAlert } from './uiActions';
import api from '../../services/apiService';

// Get overall platform statistics
export const getPlatformStats = () => async (dispatch) => {
  try {
    dispatch({ type: STATS_LOADING });
    
    const res = await api.get('/stats/platform');
    
    dispatch({
      type: STATS_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch platform statistics';
    dispatch({ type: STATS_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Get user's personal referral statistics
export const getUserStats = () => async (dispatch) => {
  try {
    dispatch({ type: USER_STATS_LOADING });
    
    const res = await api.get('/stats/user');
    
    dispatch({
      type: USER_STATS_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch user statistics';
    dispatch({ type: USER_STATS_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Get company referral statistics
export const getCompanyStats = (companyId) => async (dispatch) => {
  try {
    dispatch({ type: STATS_LOADING });
    
    const res = await api.get(`/stats/company/${companyId}`);
    
    // Use the general stats success type but specify company in the payload
    dispatch({
      type: STATS_SUCCESS,
      payload: {
        ...res.data,
        statsType: 'company'
      }
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch company statistics';
    dispatch({ type: STATS_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Get job category statistics (for data visualization)
export const getJobCategoryStats = () => async (dispatch) => {
  try {
    dispatch({ type: STATS_LOADING });
    
    const res = await api.get('/stats/job-categories');
    
    // Use the general stats success type but specify job categories in the payload
    dispatch({
      type: STATS_SUCCESS,
      payload: {
        ...res.data,
        statsType: 'jobCategories'
      }
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch job category statistics';
    dispatch({ type: STATS_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
  }
}; 