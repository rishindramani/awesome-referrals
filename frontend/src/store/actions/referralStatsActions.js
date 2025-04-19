import {
  STATS_LOADING,
  STATS_SUCCESS,
  STATS_ERROR,
  USER_STATS_LOADING,
  USER_STATS_SUCCESS,
  USER_STATS_ERROR
} from './actionTypes';
import { setAlert } from './uiActions';
import { apiService } from '../../services/apiService';

// Get overall platform statistics
export const getPlatformStats = () => async (dispatch) => {
  try {
    dispatch({ type: STATS_LOADING });
    
    const response = await apiService.getPlatformStats();
    
    dispatch({
      type: STATS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch platform statistics';
    
    dispatch({ type: STATS_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
    
    return null;
  }
};

// Get user's personal referral statistics
export const getUserStats = (period = 'all') => async (dispatch) => {
  try {
    dispatch({ type: USER_STATS_LOADING });
    
    const response = await apiService.getUserStats(period);
    
    dispatch({
      type: USER_STATS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch user statistics';
    
    dispatch({ type: USER_STATS_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
    
    return null;
  }
};

// Get company referral statistics
export const getCompanyStats = (companyId) => async (dispatch) => {
  try {
    dispatch({ type: STATS_LOADING });
    
    const response = await apiService.getStats(`/stats/company/${companyId}`);
    
    // Use the general stats success type but specify company in the payload
    dispatch({
      type: STATS_SUCCESS,
      payload: {
        ...response.data,
        statsType: 'company'
      }
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch company statistics';
    
    dispatch({ type: STATS_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
    
    return null;
  }
};

// Get job category statistics (for data visualization)
export const getJobCategoryStats = () => async (dispatch) => {
  try {
    dispatch({ type: STATS_LOADING });
    
    const response = await apiService.getStats('/stats/job-categories');
    
    // Use the general stats success type but specify job categories in the payload
    dispatch({
      type: STATS_SUCCESS,
      payload: {
        ...response.data,
        statsType: 'jobCategories'
      }
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch job category statistics';
    
    dispatch({ type: STATS_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
    
    return null;
  }
}; 