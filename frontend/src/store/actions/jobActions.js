import axios from 'axios';
import {
  JOBS_LOADING,
  JOBS_SUCCESS,
  JOBS_ERROR,
  JOB_DETAIL_LOADING,
  JOB_DETAIL_SUCCESS,
  JOB_DETAIL_ERROR,
  SAVED_JOBS_LOADING,
  SAVED_JOBS_SUCCESS,
  SAVED_JOBS_ERROR,
  TOP_JOBS_SUCCESS,
  SAVE_JOB_SUCCESS
} from './actionTypes';
import { setAlert, setLoading, clearLoading } from './uiActions';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all jobs with pagination
export const getJobs = (page = 1, limit = 10, filters = {}) => async (dispatch, getState) => {
  try {
    dispatch({ type: JOBS_LOADING });
    
    const { token } = getState().auth;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    // Construct URL with query parameters
    let url = `${API_URL}/jobs?page=${page}&limit=${limit}`;
    
    // Add filters if present
    if (filters.title) url += `&title=${encodeURIComponent(filters.title)}`;
    if (filters.company) url += `&company=${encodeURIComponent(filters.company)}`;
    if (filters.location) url += `&location=${encodeURIComponent(filters.location)}`;
    if (filters.type) url += `&type=${filters.type}`;
    
    const res = await axios.get(url, config);
    
    dispatch({
      type: JOBS_SUCCESS,
      payload: {
        jobs: res.data.jobs,
        pagination: res.data.pagination
      }
    });
  } catch (err) {
    const errorMessage = err.response?.data.message || 'Failed to fetch jobs';
    dispatch({ type: JOBS_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Get job details by ID
export const getJobById = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: JOB_DETAIL_LOADING });
    
    const { token } = getState().auth;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const res = await axios.get(`${API_URL}/jobs/${id}`, config);
    
    dispatch({
      type: JOB_DETAIL_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = err.response?.data.message || 'Failed to fetch job details';
    dispatch({ type: JOB_DETAIL_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Search jobs
export const searchJobs = (searchTerm) => async (dispatch, getState) => {
  try {
    dispatch(setLoading());
    dispatch({ type: JOBS_LOADING });
    
    const { token } = getState().auth;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const res = await axios.get(
      `${API_URL}/jobs/search?q=${encodeURIComponent(searchTerm)}`, 
      config
    );
    
    dispatch({
      type: JOBS_SUCCESS,
      payload: {
        jobs: res.data.jobs,
        pagination: res.data.pagination
      }
    });
    
    dispatch(clearLoading());
  } catch (err) {
    const errorMessage = err.response?.data.message || 'Failed to search jobs';
    dispatch({ type: JOBS_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
    dispatch(clearLoading());
  }
};

// Get top/featured jobs
export const getTopJobs = (limit = 5) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const res = await axios.get(`${API_URL}/jobs/featured?limit=${limit}`, config);
    
    dispatch({
      type: TOP_JOBS_SUCCESS,
      payload: res.data.jobs
    });
  } catch (err) {
    const errorMessage = err.response?.data.message || 'Failed to fetch featured jobs';
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Save a job (add to user's saved jobs)
export const saveJob = (jobId) => async (dispatch, getState) => {
  try {
    dispatch(setLoading());
    
    const { token } = getState().auth;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const res = await axios.post(`${API_URL}/jobs/${jobId}/save`, {}, config);
    
    dispatch({
      type: SAVE_JOB_SUCCESS,
      payload: res.data
    });
    
    dispatch(setAlert('Job saved successfully', 'success'));
    dispatch(clearLoading());
  } catch (err) {
    const errorMessage = err.response?.data.message || 'Failed to save job';
    dispatch(setAlert(errorMessage, 'error'));
    dispatch(clearLoading());
  }
};

// Unsave a job (remove from user's saved jobs)
export const unsaveJob = (jobId) => async (dispatch, getState) => {
  try {
    dispatch(setLoading());
    
    const { token } = getState().auth;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    await axios.delete(`${API_URL}/jobs/${jobId}/save`, config);
    
    // Dispatch an action to update the saved jobs list
    dispatch({
      type: SAVE_JOB_SUCCESS,
      payload: { id: jobId, removed: true }
    });
    
    dispatch(setAlert('Job removed from saved jobs', 'success'));
    dispatch(clearLoading());
  } catch (err) {
    const errorMessage = err.response?.data.message || 'Failed to remove job from saved jobs';
    dispatch(setAlert(errorMessage, 'error'));
    dispatch(clearLoading());
  }
};

// Get user's saved jobs
export const getSavedJobs = () => async (dispatch, getState) => {
  try {
    dispatch({ type: SAVED_JOBS_LOADING });
    
    const { token } = getState().auth;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
    
    const res = await axios.get(`${API_URL}/jobs/saved`, config);
    
    dispatch({
      type: SAVED_JOBS_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = 
      err.response && err.response.data.message 
        ? err.response.data.message 
        : 'Failed to fetch saved jobs';
        
    dispatch({
      type: SAVED_JOBS_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
}; 