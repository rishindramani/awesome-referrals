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
import { setAlert } from './uiActions';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all companies with pagination
export const getCompanies = (page = 1, limit = 10) => async (dispatch) => {
  try {
    dispatch({ type: COMPANIES_LOADING });
    
    const res = await axios.get(`${API_URL}/companies?page=${page}&limit=${limit}`);
    
    dispatch({
      type: COMPANIES_SUCCESS,
      payload: {
        companies: res.data.companies,
        pagination: res.data.pagination
      }
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch companies';
    dispatch({ type: COMPANIES_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Get company details by ID
export const getCompanyById = (id) => async (dispatch) => {
  try {
    dispatch({ type: COMPANY_DETAIL_LOADING });
    
    const res = await axios.get(`${API_URL}/companies/${id}`);
    
    dispatch({
      type: COMPANY_DETAIL_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch company details';
    dispatch({ type: COMPANY_DETAIL_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Search companies
export const searchCompanies = (searchTerm) => async (dispatch) => {
  try {
    dispatch({ type: COMPANIES_LOADING });
    
    const res = await axios.get(`${API_URL}/companies/search?q=${encodeURIComponent(searchTerm)}`);
    
    dispatch({
      type: COMPANIES_SUCCESS,
      payload: {
        companies: res.data.companies,
        pagination: res.data.pagination
      }
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to search companies';
    dispatch({ type: COMPANIES_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Get top companies
export const getTopCompanies = (limit = 5) => async (dispatch) => {
  try {
    const res = await axios.get(`${API_URL}/companies/top?limit=${limit}`);
    
    dispatch({
      type: TOP_COMPANIES_SUCCESS,
      payload: res.data.companies
    });
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch top companies';
    dispatch(setAlert(errorMessage, 'error'));
  }
}; 