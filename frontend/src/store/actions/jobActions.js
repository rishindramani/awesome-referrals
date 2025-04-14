import {
  JOBS_LOADING,
  JOBS_SUCCESS,
  JOBS_ERROR,
  JOB_DETAIL_LOADING,
  JOB_DETAIL_SUCCESS,
  JOB_DETAIL_ERROR,
  JOB_CREATE_LOADING,
  JOB_CREATE_SUCCESS,
  JOB_CREATE_ERROR,
  JOB_UPDATE_LOADING,
  JOB_UPDATE_SUCCESS,
  JOB_UPDATE_ERROR,
  JOB_DELETE_SUCCESS,
  JOB_DELETE_ERROR,
  JOB_SEARCH_SUCCESS,
  JOB_SEARCH_ERROR,
  SAVED_JOBS_LOADING,
  SAVED_JOBS_SUCCESS,
  SAVED_JOBS_ERROR,
  TOP_JOBS_SUCCESS,
  SAVE_JOB_SUCCESS,
  SET_ALERT
} from './actionTypes';
import { setAlert } from './uiActions';
import apiService from '../../services/apiService';

// Get all jobs
export const getJobs = (page = 1, limit = 10) => async (dispatch) => {
  try {
    dispatch({ type: JOBS_LOADING });
    
    const res = await apiService.jobs.getAll({ page, limit });
    
    dispatch({
      type: JOBS_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch jobs';
    
    dispatch({
      type: JOBS_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Get job details by ID
export const getJobById = (id) => async (dispatch) => {
  try {
    dispatch({ type: JOB_DETAIL_LOADING });
    
    const res = await apiService.jobs.getById(id);
    
    dispatch({
      type: JOB_DETAIL_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch job details';
    
    dispatch({
      type: JOB_DETAIL_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Create a new job (requires authentication)
export const createJob = (jobData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: JOB_CREATE_LOADING });
    
    const res = await apiService.jobs.create(jobData);
    
    dispatch({
      type: JOB_CREATE_SUCCESS,
      payload: res.data
    });
    
    dispatch(setAlert('Job created successfully', 'success'));
    
    // Navigate to job details
    if (navigate) {
      navigate(`/jobs/${res.data.id}`);
    }
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to create job';
    
    dispatch({
      type: JOB_CREATE_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Update a job (requires authentication)
export const updateJob = (id, jobData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: JOB_UPDATE_LOADING });
    
    const res = await apiService.jobs.update(id, jobData);
    
    dispatch({
      type: JOB_UPDATE_SUCCESS,
      payload: res.data
    });
    
    dispatch(setAlert('Job updated successfully', 'success'));
    
    // Navigate to job details
    if (navigate) {
      navigate(`/jobs/${id}`);
    }
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to update job';
    
    dispatch({
      type: JOB_UPDATE_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Delete a job (requires authentication)
export const deleteJob = (id, navigate) => async (dispatch) => {
  try {
    await apiService.jobs.delete(id);
    
    dispatch({
      type: JOB_DELETE_SUCCESS,
      payload: id
    });
    
    dispatch(setAlert('Job deleted successfully', 'success'));
    
    // Navigate to jobs list
    if (navigate) {
      navigate('/jobs');
    }
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to delete job';
    
    dispatch({
      type: JOB_DELETE_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Search jobs by keyword, location, or other criteria
export const searchJobs = (searchParams) => async (dispatch) => {
  try {
    dispatch({ type: JOBS_LOADING });
    
    const res = await apiService.jobs.search(searchParams);
    
    dispatch({
      type: JOB_SEARCH_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to search jobs';
    
    dispatch({
      type: JOB_SEARCH_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Get saved jobs for the current user
export const getSavedJobs = () => async (dispatch) => {
  try {
    dispatch({ type: SAVED_JOBS_LOADING });
    
    const res = await apiService.jobs.getSaved();
    
    dispatch({
      type: SAVED_JOBS_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch saved jobs';
    
    dispatch({
      type: SAVED_JOBS_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Save a job for the current user
export const saveJob = (jobId) => async (dispatch) => {
  try {
    await apiService.jobs.saveJob(jobId);
    
    dispatch({
      type: SAVE_JOB_SUCCESS,
      payload: jobId
    });
    
    dispatch(setAlert('Job saved successfully', 'success'));
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to save job';
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Unsave (remove) a job for the current user
export const unsaveJob = (jobId) => async (dispatch) => {
  try {
    await apiService.jobs.unsaveJob(jobId);
    
    dispatch({
      type: 'UNSAVE_JOB_SUCCESS',
      payload: jobId
    });
    
    dispatch(setAlert('Job removed from saved list', 'success'));
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to remove saved job';
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Get top/featured jobs
export const getTopJobs = (limit) => async (dispatch) => {
  try {
    const res = await apiService.jobs.getTopJobs();
    
    dispatch({
      type: TOP_JOBS_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch top jobs';
    dispatch(setAlert(errorMessage, 'error'));
  }
}; 