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
import { setAlert } from './uiActions';
import api from '../../services/apiService';

// Get all referrals for the current user
export const getReferrals = () => async (dispatch) => {
  try {
    dispatch({ type: REFERRALS_LOADING });
    
    const res = await api.get('/referrals');
    
    dispatch({
      type: REFERRALS_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch referrals';
        
    dispatch({
      type: REFERRALS_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Get referral by ID
export const getReferralById = (id) => async (dispatch) => {
  try {
    dispatch({ type: REFERRAL_DETAIL_LOADING });
    
    const res = await api.get(`/referrals/${id}`);
    
    dispatch({
      type: REFERRAL_DETAIL_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch referral details';
        
    dispatch({
      type: REFERRAL_DETAIL_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Create a new referral request
export const createReferralRequest = (referralData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: REFERRAL_CREATE_LOADING });
    
    const res = await api.post('/referrals', referralData);
    
    dispatch({
      type: REFERRAL_CREATE_SUCCESS,
      payload: res.data
    });
    
    dispatch(setAlert('Referral request sent successfully', 'success'));
    
    // Navigate to referrals list
    if (navigate) {
      navigate('/referrals');
    }
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to create referral request';
        
    dispatch({
      type: REFERRAL_CREATE_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Update referral status (accepted, rejected, completed)
export const updateReferralStatus = (id, status) => async (dispatch) => {
  try {
    dispatch({ type: REFERRAL_UPDATE_LOADING });
    
    const res = await api.put(`/referrals/${id}/status`, { status });
    
    dispatch({
      type: REFERRAL_UPDATE_SUCCESS,
      payload: res.data
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
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to update referral status';
        
    dispatch({
      type: REFERRAL_UPDATE_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Add note to referral
export const addReferralNote = (id, note) => async (dispatch) => {
  try {
    const res = await api.post(`/referrals/${id}/notes`, { note });
    
    dispatch({
      type: REFERRAL_NOTE_ADD_SUCCESS,
      payload: res.data
    });
    
    dispatch(setAlert('Note added to referral', 'success'));
    
    // Refresh referral details
    dispatch(getReferralById(id));
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to add note to referral';
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Upload attachment to referral
export const uploadReferralAttachment = (id, file) => async (dispatch) => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    
    await api.post(`/referrals/${id}/attachments`, formData, config);
    
    dispatch(setAlert('File uploaded successfully', 'success'));
    
    // Refresh referral details
    dispatch(getReferralById(id));
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to upload attachment';
    
    dispatch(setAlert(errorMessage, 'error'));
  }
}; 