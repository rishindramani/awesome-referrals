import axios from 'axios';
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

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all jobs
export const getJobs = (page = 1, limit = 10) => async (dispatch) => {
  try {
    dispatch({ type: JOBS_LOADING });
    
    const res = await axios.get(`${API_URL}/jobs?page=${page}&limit=${limit}`);
    
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

// Get job by ID
export const getJobById = (id) => async (dispatch) => {
  try {
    dispatch({ type: JOB_DETAIL_LOADING });
    
    const res = await axios.get(`${API_URL}/jobs/${id}`);
    
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
export const createJob = (jobData, navigate) => async (dispatch, getState) => {
  try {
    dispatch({ type: JOB_CREATE_LOADING });
    
    const { token } = getState().auth;
    const config = { headers: { 'Authorization': `Bearer ${token}` } };
    
    const res = await axios.post(`${API_URL}/jobs`, jobData, config);
    
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

// Update an existing job (requires authentication)
export const updateJob = (id, jobData, navigate) => async (dispatch, getState) => {
  try {
    dispatch({ type: JOB_UPDATE_LOADING });
    
    const { token } = getState().auth;
    const config = { headers: { 'Authorization': `Bearer ${token}` } };
    
    const res = await axios.put(`${API_URL}/jobs/${id}`, jobData, config);
    
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
export const deleteJob = (id, navigate) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const config = { headers: { 'Authorization': `Bearer ${token}` } };
    
    await axios.delete(`${API_URL}/jobs/${id}`, config);
    
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

// Search jobs by keywords, location, etc.
export const searchJobs = (searchParams) => async (dispatch) => {
  try {
    dispatch({ type: JOBS_LOADING });
    
    // Construct query string from searchParams object
    const queryParams = new URLSearchParams();
    
    if (searchParams.keywords) {
      queryParams.append('keywords', searchParams.keywords);
    }
    
    if (searchParams.location) {
      queryParams.append('location', searchParams.location);
    }
    
    if (searchParams.companyId) {
      queryParams.append('companyId', searchParams.companyId);
    }
    
    if (searchParams.jobType) {
      queryParams.append('jobType', searchParams.jobType);
    }
    
    if (searchParams.page) {
      queryParams.append('page', searchParams.page);
    }
    
    if (searchParams.limit) {
      queryParams.append('limit', searchParams.limit);
    }
    
    const res = await axios.get(`${API_URL}/jobs/search?${queryParams.toString()}`);
    
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

// Get featured or top jobs
export const getFeaturedJobs = (limit = 6) => async (dispatch) => {
  try {
    dispatch({ type: JOBS_LOADING });
    
    const res = await axios.get(`${API_URL}/jobs/featured?limit=${limit}`);
    
    dispatch({
      type: JOBS_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch featured jobs';
    
    dispatch({
      type: JOBS_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Get jobs by company
export const getJobsByCompany = (companyId, page = 1, limit = 10) => async (dispatch) => {
  try {
    dispatch({ type: JOBS_LOADING });
    
    const res = await axios.get(`${API_URL}/companies/${companyId}/jobs?page=${page}&limit=${limit}`);
    
    dispatch({
      type: JOBS_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch company jobs';
    
    dispatch({
      type: JOBS_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Get user's saved jobs
export const getSavedJobs = () => async (dispatch) => {
  try {
    dispatch({ type: SAVED_JOBS_LOADING });
    
    const res = await axios.get(`${API_URL}/users/me/saved-jobs`);
    
    dispatch({
      type: SAVED_JOBS_SUCCESS,
      payload: res.data.jobs
    });
  } catch (err) {
    dispatch({
      type: SAVED_JOBS_ERROR,
      payload: err.response?.data?.message || 'Error fetching saved jobs'
    });
  }
};

// Get top trending jobs
export const getTopJobs = () => async (dispatch) => {
  try {
    const res = await axios.get(`${API_URL}/jobs/top`);
    
    dispatch({
      type: TOP_JOBS_SUCCESS,
      payload: res.data.jobs
    });
  } catch (err) {
    console.error('Error fetching top jobs:', err);
  }
};

// Save a job to user's favorites
export const saveJob = (jobId) => async (dispatch) => {
  try {
    await axios.post(`${API_URL}/users/me/saved-jobs/${jobId}`);
    
    dispatch({
      type: SAVE_JOB_SUCCESS,
      payload: { jobId, removed: false }
    });
    
    dispatch({
      type: SET_ALERT,
      payload: {
        id: new Date().getTime(),
        type: 'success',
        message: 'Job saved successfully'
      }
    });
  } catch (err) {
    dispatch({
      type: SET_ALERT,
      payload: {
        id: new Date().getTime(),
        type: 'error',
        message: err.response?.data?.message || 'Error saving job'
      }
    });
  }
};

// Remove a job from user's favorites
export const unsaveJob = (jobId) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL}/users/me/saved-jobs/${jobId}`);
    
    // Dispatch success action to update saved jobs list
    dispatch({
      type: SAVE_JOB_SUCCESS,
      payload: { jobId, removed: true }
    });
    
    dispatch({
      type: SET_ALERT,
      payload: {
        id: new Date().getTime(),
        type: 'success',
        message: 'Job removed from saved list'
      }
    });
  } catch (err) {
    dispatch({
      type: SET_ALERT,
      payload: {
        id: new Date().getTime(),
        type: 'error',
        message: err.response?.data?.message || 'Error removing saved job'
      }
    });
  }
}; 