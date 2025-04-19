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
import { apiService } from '../../services/apiService';

// Get current user profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    dispatch({ type: PROFILE_LOADING });

    const response = await apiService.profiles.getCurrentProfile();

    dispatch({
      type: PROFILE_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
    
    dispatch({
      type: PROFILE_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
    return null;
  }
};

// Get profile by user ID
export const getProfileByUserId = (userId) => async (dispatch) => {
  try {
    dispatch({ type: PROFILE_LOADING });

    const response = await apiService.profiles.getProfileByUserId(userId);

    dispatch({
      type: PROFILE_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
    
    dispatch({
      type: PROFILE_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
    return null;
  }
};

// Create or update user profile
export const updateProfile = (profileData, navigate) => async (dispatch) => {
  try {
    const response = await apiService.profiles.updateProfile(profileData);

    dispatch({
      type: PROFILE_UPDATE_SUCCESS,
      payload: response.data
    });

    dispatch(setAlert('Profile updated successfully', 'success'));

    if (navigate) {
      navigate('/dashboard');
    }
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to update profile';
    
    dispatch({
      type: PROFILE_UPDATE_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
    return null;
  }
};

// Add profile experience
export const addExperience = (experienceData, navigate) => async (dispatch) => {
  try {
    const response = await apiService.profiles.addExperience(experienceData);

    dispatch({
      type: EXPERIENCE_ADD_SUCCESS,
      payload: response.data
    });

    dispatch(setAlert('Experience added successfully', 'success'));

    if (navigate) {
      navigate('/dashboard');
    }
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to add experience';
    
    dispatch({
      type: EXPERIENCE_ADD_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
    return null;
  }
};

// Delete profile experience
export const deleteExperience = (experienceId) => async (dispatch) => {
  try {
    await apiService.profiles.deleteExperience(experienceId);

    dispatch({
      type: EXPERIENCE_DELETE_SUCCESS,
      payload: experienceId
    });

    dispatch(setAlert('Experience removed successfully', 'success'));
    
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to delete experience';
    
    dispatch({
      type: EXPERIENCE_DELETE_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
    return null;
  }
};

// Add profile education
export const addEducation = (educationData, navigate) => async (dispatch) => {
  try {
    const response = await apiService.profiles.addEducation(educationData);

    dispatch({
      type: EDUCATION_ADD_SUCCESS,
      payload: response.data
    });

    dispatch(setAlert('Education added successfully', 'success'));

    if (navigate) {
      navigate('/dashboard');
    }
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to add education';
    
    dispatch({
      type: EDUCATION_ADD_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
    return null;
  }
};

// Delete profile education
export const deleteEducation = (educationId) => async (dispatch) => {
  try {
    await apiService.profiles.deleteEducation(educationId);

    dispatch({
      type: EDUCATION_DELETE_SUCCESS,
      payload: educationId
    });

    dispatch(setAlert('Education removed successfully', 'success'));
    
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to delete education';
    
    dispatch({
      type: EDUCATION_DELETE_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
    return null;
  }
};

// Add profile skill
export const addSkill = (skillData) => async (dispatch) => {
  try {
    const response = await apiService.profiles.addSkill(skillData);

    dispatch({
      type: SKILL_ADD_SUCCESS,
      payload: response.data
    });

    dispatch(setAlert('Skill added successfully', 'success'));
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to add skill';
    
    dispatch({
      type: SKILL_ADD_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
    return null;
  }
};

// Delete profile skill
export const deleteSkill = (skillId) => async (dispatch) => {
  try {
    await apiService.profiles.deleteSkill(skillId);

    dispatch({
      type: SKILL_DELETE_SUCCESS,
      payload: skillId
    });

    dispatch(setAlert('Skill removed successfully', 'success'));
    
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to delete skill';
    
    dispatch({
      type: SKILL_DELETE_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
    return null;
  }
}; 