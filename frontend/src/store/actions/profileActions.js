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
import api from '../../services/apiService';

// Get current user profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    dispatch({ type: PROFILE_LOADING });

    const res = await api.get('/profiles/me');

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

    const res = await api.get(`/profiles/user/${userId}`);

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
export const updateProfile = (profileData, navigate) => async (dispatch) => {
  try {
    const res = await api.put('/profiles', profileData);

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
export const addExperience = (experienceData, navigate) => async (dispatch) => {
  try {
    const res = await api.post('/profiles/experience', experienceData);

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
export const deleteExperience = (experienceId) => async (dispatch) => {
  try {
    await api.delete(`/profiles/experience/${experienceId}`);

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
export const addEducation = (educationData, navigate) => async (dispatch) => {
  try {
    const res = await api.post('/profiles/education', educationData);

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
export const deleteEducation = (educationId) => async (dispatch) => {
  try {
    await api.delete(`/profiles/education/${educationId}`);

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
export const addSkill = (skillData) => async (dispatch) => {
  try {
    const res = await api.post('/profiles/skills', skillData);

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
export const deleteSkill = (skillId) => async (dispatch) => {
  try {
    await api.delete(`/profiles/skills/${skillId}`);

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