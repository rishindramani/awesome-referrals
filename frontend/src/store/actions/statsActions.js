import { apiService } from '../../services/apiService';
import { setAlert } from './uiActions';
import {
  SET_STATS_LOADING,
  SET_STATS_ERROR,
  SET_USER_STATS,
  SET_REFERRAL_STATS,
  SET_JOB_STATS,
  SET_PLATFORM_STATS,
  SET_STATS_TIME_PERIOD
} from './actionTypes';

// Set the time period filter
export const setStatsPeriod = (period) => ({
  type: SET_STATS_TIME_PERIOD,
  payload: period
});

// Get platform-wide statistics
export const getPlatformStats = () => async (dispatch) => {
  try {
    dispatch({ type: SET_STATS_LOADING });
    
    const response = await apiService.getPlatformStats();
    
    dispatch({
      type: SET_PLATFORM_STATS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: SET_STATS_ERROR,
      payload: error.response?.data?.message || 'Error fetching platform statistics'
    });
    
    dispatch(setAlert('Failed to load platform statistics', 'error'));
    return null;
  }
};

// Get user's personal statistics
export const getUserStats = (timePeriod = 'all') => async (dispatch) => {
  try {
    dispatch({ type: SET_STATS_LOADING });
    
    const response = await apiService.getUserStats(timePeriod);
    
    dispatch({
      type: SET_USER_STATS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: SET_STATS_ERROR,
      payload: error.response?.data?.message || 'Error fetching user statistics'
    });
    
    dispatch(setAlert('Failed to load your statistics', 'error'));
    return null;
  }
};

// Get referral-related statistics
export const getReferralStats = (timePeriod = 'all') => async (dispatch) => {
  try {
    dispatch({ type: SET_STATS_LOADING });
    
    const response = await apiService.getReferralStats(timePeriod);
    
    dispatch({
      type: SET_REFERRAL_STATS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: SET_STATS_ERROR,
      payload: error.response?.data?.message || 'Error fetching referral statistics'
    });
    
    dispatch(setAlert('Failed to load referral statistics', 'error'));
    return null;
  }
};

// Get job-related statistics
export const getJobStats = (timePeriod = 'all') => async (dispatch) => {
  try {
    dispatch({ type: SET_STATS_LOADING });
    
    const response = await apiService.getJobStats(timePeriod);
    
    dispatch({
      type: SET_JOB_STATS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: SET_STATS_ERROR,
      payload: error.response?.data?.message || 'Error fetching job statistics'
    });
    
    dispatch(setAlert('Failed to load job statistics', 'error'));
    return null;
  }
};

// Get all statistics in one call (for dashboard)
export const getDashboardStats = (timePeriod = 'all') => async (dispatch) => {
  try {
    dispatch({ type: SET_STATS_LOADING });
    dispatch({ type: SET_STATS_TIME_PERIOD, payload: timePeriod });
    
    const response = await apiService.getDashboardStats(timePeriod);
    
    // Dispatch individual stat updates
    if (response.data.platformStats) {
      dispatch({
        type: SET_PLATFORM_STATS,
        payload: response.data.platformStats
      });
    }
    
    if (response.data.userStats) {
      dispatch({
        type: SET_USER_STATS,
        payload: response.data.userStats
      });
    }
    
    if (response.data.referralStats) {
      dispatch({
        type: SET_REFERRAL_STATS,
        payload: response.data.referralStats
      });
    }
    
    if (response.data.jobStats) {
      dispatch({
        type: SET_JOB_STATS,
        payload: response.data.jobStats
      });
    }
    
    return response.data;
  } catch (error) {
    dispatch({
      type: SET_STATS_ERROR,
      payload: error.response?.data?.message || 'Error fetching dashboard statistics'
    });
    
    dispatch(setAlert('Failed to load dashboard statistics', 'error'));
    return null;
  }
}; 