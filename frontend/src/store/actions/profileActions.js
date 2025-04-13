import axios from 'axios';
import {
  PROFILE_LOADING,
  PROFILE_SUCCESS,
  PROFILE_ERROR,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_ERROR,
  EXPERIENCE_ADD_SUCCESS,
  EXPERIENCE_ADD_ERROR,
  EXPERIENCE_DELETE_SUCCESS,
  EXPERIENCE_DELETE_ERROR,
  EDUCATION_ADD_SUCCESS,
  EDUCATION_ADD_ERROR,
  EDUCATION_DELETE_SUCCESS,
  EDUCATION_DELETE_ERROR,
  SKILL_ADD_SUCCESS,
  SKILL_ADD_ERROR,
  SKILL_DELETE_SUCCESS,
  SKILL_DELETE_ERROR
} from './actionTypes';
import { setAlert } from './uiActions';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get current user profile
export const getCurrentProfile = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PROFILE_LOADING });

    const { token } = getState().auth;
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    const res = await axios.get(`${API_URL}/profiles/me`, config);

    dispatch({
      type: PROFILE_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch profile';
    
    dispatch({
      type: PROFILE_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Get profile by user ID
export const getProfileByUserId = (userId) => async (dispatch) => {
  try {
    dispatch({ type: PROFILE_LOADING });

    const res = await axios.get(`${API_URL}/profiles/user/${userId}`);

    dispatch({
      type: PROFILE_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch profile';
    
    dispatch({
      type: PROFILE_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Create or update user profile
export const updateProfile = (profileData, navigate) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    const res = await axios.put(`${API_URL}/profiles`, profileData, config);

    dispatch({
      type: PROFILE_UPDATE_SUCCESS,
      payload: res.data
    });

    dispatch(setAlert('Profile updated successfully', 'success'));

    if (navigate) {
      navigate('/dashboard');
    }
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to update profile';
    
    dispatch({
      type: PROFILE_UPDATE_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Add profile experience
export const addExperience = (experienceData, navigate) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    const res = await axios.post(`${API_URL}/profiles/experience`, experienceData, config);

    dispatch({
      type: EXPERIENCE_ADD_SUCCESS,
      payload: res.data
    });

    dispatch(setAlert('Experience added successfully', 'success'));

    if (navigate) {
      navigate('/dashboard');
    }
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to add experience';
    
    dispatch({
      type: EXPERIENCE_ADD_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Delete profile experience
export const deleteExperience = (experienceId) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    await axios.delete(`${API_URL}/profiles/experience/${experienceId}`, config);

    dispatch({
      type: EXPERIENCE_DELETE_SUCCESS,
      payload: experienceId
    });

    dispatch(setAlert('Experience removed successfully', 'success'));
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to delete experience';
    
    dispatch({
      type: EXPERIENCE_DELETE_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Add profile education
export const addEducation = (educationData, navigate) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    const res = await axios.post(`${API_URL}/profiles/education`, educationData, config);

    dispatch({
      type: EDUCATION_ADD_SUCCESS,
      payload: res.data
    });

    dispatch(setAlert('Education added successfully', 'success'));

    if (navigate) {
      navigate('/dashboard');
    }
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to add education';
    
    dispatch({
      type: EDUCATION_ADD_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Delete profile education
export const deleteEducation = (educationId) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    await axios.delete(`${API_URL}/profiles/education/${educationId}`, config);

    dispatch({
      type: EDUCATION_DELETE_SUCCESS,
      payload: educationId
    });

    dispatch(setAlert('Education removed successfully', 'success'));
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to delete education';
    
    dispatch({
      type: EDUCATION_DELETE_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Add profile skill
export const addSkill = (skillData) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    const res = await axios.post(`${API_URL}/profiles/skills`, skillData, config);

    dispatch({
      type: SKILL_ADD_SUCCESS,
      payload: res.data
    });

    dispatch(setAlert('Skill added successfully', 'success'));
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to add skill';
    
    dispatch({
      type: SKILL_ADD_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Delete profile skill
export const deleteSkill = (skillId) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    await axios.delete(`${API_URL}/profiles/skills/${skillId}`, config);

    dispatch({
      type: SKILL_DELETE_SUCCESS,
      payload: skillId
    });

    dispatch(setAlert('Skill removed successfully', 'success'));
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to delete skill';
    
    dispatch({
      type: SKILL_DELETE_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
}; 