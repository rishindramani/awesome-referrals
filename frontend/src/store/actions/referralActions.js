import { apiService } from '../../services/apiService';
import { setAlert } from './uiActions';
import {
  REFERRALS_LOADING,
  REFERRALS_SUCCESS,
  REFERRALS_ERROR,
  REFERRAL_DETAIL_LOADING,
  REFERRAL_DETAIL_SUCCESS,
  REFERRAL_DETAIL_ERROR,
  REFERRAL_CREATE_LOADING,
  REFERRAL_CREATE_SUCCESS,
  REFERRAL_CREATE_ERROR,
  REFERRAL_UPDATE_LOADING,
  REFERRAL_UPDATE_SUCCESS,
  REFERRAL_UPDATE_ERROR,
  REFERRAL_NOTE_ADD_SUCCESS
} from './actionTypes';

// Get all referrals for the current user
export const getReferrals = (params) => async (dispatch) => {
  try {
    dispatch({ type: REFERRALS_LOADING });
    
    const response = await apiService.referrals.getAll(params);
    
    dispatch({
      type: REFERRALS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: REFERRALS_ERROR,
      payload: error.response?.data?.message || 'Failed to fetch referrals'
    });
    
    dispatch(setAlert('Failed to fetch referrals', 'error'));
    return null;
  }
};

// Get referral by ID
export const getReferralById = (id) => async (dispatch) => {
  try {
    dispatch({ type: REFERRAL_DETAIL_LOADING });
    
    const response = await apiService.referrals.getById(id);
    
    dispatch({
      type: REFERRAL_DETAIL_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: REFERRAL_DETAIL_ERROR,
      payload: error.response?.data?.message || 'Failed to fetch referral details'
    });
    
    dispatch(setAlert('Failed to fetch referral details', 'error'));
    return null;
  }
};

// Create a new referral request
export const createReferralRequest = (referralData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: REFERRAL_CREATE_LOADING });
    
    const response = await apiService.referrals.create(referralData);
    
    dispatch({
      type: REFERRAL_CREATE_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert('Referral request sent successfully', 'success'));
    
    // Navigate to referrals list
    if (navigate) {
      navigate('/referrals');
    }
    
    return response.data;
  } catch (error) {
    dispatch({
      type: REFERRAL_CREATE_ERROR,
      payload: error.response?.data?.message || 'Failed to create referral request'
    });
    
    dispatch(setAlert(error.response?.data?.message || 'Failed to create referral request', 'error'));
    return null;
  }
};

// Update referral status (accepted, rejected, completed)
export const updateReferralStatus = (id, status) => async (dispatch) => {
  try {
    dispatch({ type: REFERRAL_UPDATE_LOADING });
    
    const response = await apiService.referrals.update(id, { status });
    
    dispatch({
      type: REFERRAL_UPDATE_SUCCESS,
      payload: response.data
    });
    
    let message = '';
    switch(status) {
      case 'accepted':
        message = 'Referral accepted successfully';
        break;
      case 'rejected':
        message = 'Referral rejected';
        break;
      case 'completed':
        message = 'Referral marked as completed';
        break;
      default:
        message = 'Referral status updated';
    }
    
    dispatch(setAlert(message, 'success'));
    return response.data;
  } catch (error) {
    dispatch({
      type: REFERRAL_UPDATE_ERROR,
      payload: error.response?.data?.message || 'Failed to update referral status'
    });
    
    dispatch(setAlert(error.response?.data?.message || 'Failed to update referral status', 'error'));
    return null;
  }
};

// Add note to referral
export const addReferralNote = (id, note) => async (dispatch) => {
  try {
    const response = await apiService.referrals.addReferralNote(id, note);
    
    dispatch({
      type: REFERRAL_NOTE_ADD_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert('Note added to referral', 'success'));
    
    // Refresh referral details
    dispatch(getReferralById(id));
    
    return response.data;
  } catch (error) {
    dispatch(setAlert(error.response?.data?.message || 'Failed to add note to referral', 'error'));
    return null;
  }
};

// Upload attachment to referral
export const uploadReferralAttachment = (id, file) => async (dispatch) => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiService.referrals.uploadAttachment(id, formData);
    
    dispatch(setAlert('File uploaded successfully', 'success'));
    
    // Refresh referral details
    dispatch(getReferralById(id));
    
    return response.data;
  } catch (error) {
    dispatch(setAlert(error.response?.data?.message || 'Failed to upload attachment', 'error'));
    return null;
  }
}; 