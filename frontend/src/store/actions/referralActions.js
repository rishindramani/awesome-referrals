import axios from 'axios';
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
} from '../actions/actionTypes';
import { setAlert } from './uiActions';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all referrals for the current user
export const getReferrals = () => async (dispatch, getState) => {
  try {
    dispatch({ type: REFERRALS_LOADING });
    
    const { token } = getState().auth;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
    
    const res = await axios.get(`${API_URL}/referrals`, config);
    
    dispatch({
      type: REFERRALS_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = 
      err.response && err.response.data.message 
        ? err.response.data.message 
        : 'Failed to fetch referrals';
        
    dispatch({
      type: REFERRALS_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert('Error fetching referrals', 'error'));
  }
};

// Get referral by ID
export const getReferralById = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: REFERRAL_DETAIL_LOADING });
    
    const { token } = getState().auth;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
    
    const res = await axios.get(`${API_URL}/referrals/${id}`, config);
    
    dispatch({
      type: REFERRAL_DETAIL_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = 
      err.response && err.response.data.message 
        ? err.response.data.message 
        : 'Failed to fetch referral details';
        
    dispatch({
      type: REFERRAL_DETAIL_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert('Error fetching referral details', 'error'));
  }
};

// Create a new referral request
export const createReferralRequest = (referralData, navigate) => async (dispatch, getState) => {
  try {
    dispatch({ type: REFERRAL_CREATE_LOADING });
    
    const { token } = getState().auth;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
    
    const res = await axios.post(`${API_URL}/referrals`, referralData, config);
    
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
    const errorMessage = 
      err.response && err.response.data.message 
        ? err.response.data.message 
        : 'Failed to create referral request';
        
    dispatch({
      type: REFERRAL_CREATE_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Update referral status (accepted, rejected, completed)
export const updateReferralStatus = (id, status) => async (dispatch, getState) => {
  try {
    dispatch({ type: REFERRAL_UPDATE_LOADING });
    
    const { token } = getState().auth;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
    
    const res = await axios.put(
      `${API_URL}/referrals/${id}/status`, 
      { status }, 
      config
    );
    
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
    const errorMessage = 
      err.response && err.response.data.message 
        ? err.response.data.message 
        : 'Failed to update referral status';
        
    dispatch({
      type: REFERRAL_UPDATE_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Add note to referral
export const addReferralNote = (id, note) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
    
    const res = await axios.post(
      `${API_URL}/referrals/${id}/notes`, 
      { note }, 
      config
    );
    
    dispatch({
      type: REFERRAL_NOTE_ADD_SUCCESS,
      payload: res.data
    });
    
    dispatch(setAlert('Note added to referral', 'success'));
    
    // Refresh referral details
    dispatch(getReferralById(id));
  } catch (err) {
    const errorMessage = 
      err.response && err.response.data.message 
        ? err.response.data.message 
        : 'Failed to add note to referral';
    
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Upload attachment to referral
export const uploadReferralAttachment = (id, file) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    };
    
    await axios.post(
      `${API_URL}/referrals/${id}/attachments`, 
      formData, 
      config
    );
    
    dispatch(setAlert('File uploaded successfully', 'success'));
    
    // Refresh referral details
    dispatch(getReferralById(id));
  } catch (err) {
    const errorMessage = 
      err.response && err.response.data.message 
        ? err.response.data.message 
        : 'Failed to upload attachment';
    
    dispatch(setAlert(errorMessage, 'error'));
  }
}; 