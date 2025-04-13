import axios from 'axios';
import {
  COMPANIES_LOADING,
  COMPANIES_SUCCESS,
  COMPANIES_ERROR,
  COMPANY_DETAIL_LOADING,
  COMPANY_DETAIL_SUCCESS,
  COMPANY_DETAIL_ERROR,
  TOP_COMPANIES_SUCCESS
} from './actionTypes';
import { setAlert, setLoading, clearLoading } from './uiActions';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all companies with pagination
export const getCompanies = (page = 1, limit = 10) => async (dispatch, getState) => {
  try {
    dispatch({ type: COMPANIES_LOADING });
    
    const { token } = getState().auth;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const res = await axios.get(`${API_URL}/companies?page=${page}&limit=${limit}`, config);
    
    dispatch({
      type: COMPANIES_SUCCESS,
      payload: {
        companies: res.data.companies,
        pagination: res.data.pagination
      }
    });
  } catch (err) {
    const errorMessage = err.response?.data.message || 'Failed to fetch companies';
    dispatch({ type: COMPANIES_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Get company details by ID
export const getCompanyById = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: COMPANY_DETAIL_LOADING });
    
    const { token } = getState().auth;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const res = await axios.get(`${API_URL}/companies/${id}`, config);
    
    dispatch({
      type: COMPANY_DETAIL_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = err.response?.data.message || 'Failed to fetch company details';
    dispatch({ type: COMPANY_DETAIL_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Search companies
export const searchCompanies = (searchTerm) => async (dispatch, getState) => {
  try {
    dispatch(setLoading());
    dispatch({ type: COMPANIES_LOADING });
    
    const { token } = getState().auth;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const res = await axios.get(
      `${API_URL}/companies/search?q=${encodeURIComponent(searchTerm)}`, 
      config
    );
    
    dispatch({
      type: COMPANIES_SUCCESS,
      payload: {
        companies: res.data.companies,
        pagination: res.data.pagination
      }
    });
    
    dispatch(clearLoading());
  } catch (err) {
    const errorMessage = err.response?.data.message || 'Failed to search companies';
    dispatch({ type: COMPANIES_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
    dispatch(clearLoading());
  }
};

// Get top companies
export const getTopCompanies = (limit = 5) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const res = await axios.get(`${API_URL}/companies/top?limit=${limit}`, config);
    
    dispatch({
      type: TOP_COMPANIES_SUCCESS,
      payload: res.data.companies
    });
  } catch (err) {
    const errorMessage = err.response?.data.message || 'Failed to fetch top companies';
    dispatch(setAlert(errorMessage, 'error'));
  }
}; 