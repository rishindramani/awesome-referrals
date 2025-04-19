import { apiService } from '../../services/apiService';
import { setAlert } from './uiActions';
import {
  JOBS_LOADING,
  JOBS_SUCCESS,
  JOBS_ERROR,
  JOB_LOADING,
  JOB_SUCCESS,
  JOB_ERROR,
  SAVED_JOBS_LOADING,
  SAVED_JOBS_SUCCESS,
  SAVED_JOBS_ERROR,
  JOB_SAVED_SUCCESS,
  JOB_UNSAVED_SUCCESS,
  TRENDING_JOBS_LOADING,
  TRENDING_JOBS_SUCCESS,
  TRENDING_JOBS_ERROR
} from './actionTypes';

// Get all jobs with pagination and filtering
export const getJobs = (params) => async (dispatch) => {
  try {
    dispatch({ type: JOBS_LOADING });
    
    const response = await apiService.jobs.getAll(params);
    
    dispatch({
      type: JOBS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: JOBS_ERROR,
      payload: error.response?.data?.message || 'Failed to fetch jobs'
    });
    
    dispatch(setAlert('Failed to fetch jobs', 'error'));
    return null;
  }
};

// Get a specific job by ID
export const getJobById = (id) => async (dispatch) => {
  try {
    dispatch({ type: JOB_LOADING });
    
    const response = await apiService.jobs.getById(id);
    
    dispatch({
      type: JOB_SUCCESS,
      payload: response.data.data.job
    });
    
    return response.data.data.job;
  } catch (error) {
    dispatch({
      type: JOB_ERROR,
      payload: error.response?.data?.message || 'Failed to fetch job details'
    });
    
    dispatch(setAlert('Failed to fetch job details', 'error'));
    return null;
  }
};

// Search jobs with multiple filters
export const searchJobs = (params) => async (dispatch) => {
  try {
    dispatch({ type: JOBS_LOADING });
    
    const response = await apiService.jobs.search(params);
    
    dispatch({
      type: JOBS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: JOBS_ERROR,
      payload: error.response?.data?.message || 'Failed to search jobs'
    });
    
    dispatch(setAlert('Failed to search jobs', 'error'));
    return null;
  }
};

// Get jobs saved by the user
export const getSavedJobs = (params) => async (dispatch) => {
  try {
    dispatch({ type: SAVED_JOBS_LOADING });
    
    const response = await apiService.jobs.getSaved(params);
    
    dispatch({
      type: SAVED_JOBS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: SAVED_JOBS_ERROR,
      payload: error.response?.data?.message || 'Failed to fetch saved jobs'
    });
    
    dispatch(setAlert('Failed to fetch saved jobs', 'error'));
    return null;
  }
};

// Save a job for later
export const saveJob = (jobId) => async (dispatch) => {
  try {
    const response = await apiService.jobs.saveJob(jobId);
    
    dispatch({
      type: JOB_SAVED_SUCCESS,
      payload: { jobId, message: response.data.message }
    });
    
    dispatch(setAlert('Job saved successfully', 'success'));
    return response.data;
  } catch (error) {
    dispatch(setAlert(error.response?.data?.message || 'Failed to save job', 'error'));
    return null;
  }
};

// Unsave/remove a job from saved list
export const unsaveJob = (jobId) => async (dispatch) => {
  try {
    const response = await apiService.jobs.unsaveJob(jobId);
    
    dispatch({
      type: JOB_UNSAVED_SUCCESS,
      payload: { jobId, message: response.data.message }
    });
    
    dispatch(setAlert('Job removed from saved list', 'success'));
    return response.data;
  } catch (error) {
    dispatch(setAlert(error.response?.data?.message || 'Failed to remove job from saved list', 'error'));
    return null;
  }
};

// Get trending/top jobs
export const getTrendingJobs = () => async (dispatch) => {
  try {
    dispatch({ type: TRENDING_JOBS_LOADING });
    
    const response = await apiService.jobs.getTopJobs();
    
    dispatch({
      type: TRENDING_JOBS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: TRENDING_JOBS_ERROR,
      payload: error.response?.data?.message || 'Failed to fetch trending jobs'
    });
    
    dispatch(setAlert('Failed to fetch trending jobs', 'error'));
    return null;
  }
}; 