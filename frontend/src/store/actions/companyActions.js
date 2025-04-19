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
import { apiService } from '../../services/apiService';

// Get all companies with pagination
export const getCompanies = (params) => async (dispatch) => {
  try {
    dispatch({ type: COMPANIES_LOADING });
    
    const response = await apiService.companies.getAll(params);
    
    dispatch({
      type: COMPANIES_SUCCESS,
      payload: {
        companies: response.data.companies,
        pagination: response.data.pagination
      }
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch companies';
    
    dispatch({ type: COMPANIES_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
    
    return null;
  }
};

// Get company details by ID
export const getCompanyById = (id) => async (dispatch) => {
  try {
    dispatch({ type: COMPANY_DETAIL_LOADING });
    
    const response = await apiService.companies.getById(id);
    
    dispatch({
      type: COMPANY_DETAIL_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch company details';
    
    dispatch({ type: COMPANY_DETAIL_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
    
    return null;
  }
};

// Search companies
export const searchCompanies = (searchParams) => async (dispatch) => {
  try {
    dispatch({ type: COMPANIES_LOADING });
    
    const response = await apiService.companies.search(searchParams);
    
    dispatch({
      type: COMPANIES_SUCCESS,
      payload: {
        companies: response.data.companies,
        pagination: response.data.pagination
      }
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to search companies';
    
    dispatch({ type: COMPANIES_ERROR, payload: errorMessage });
    dispatch(setAlert(errorMessage, 'error'));
    
    return null;
  }
};

// Get top companies
export const getTopCompanies = (limit = 5) => async (dispatch) => {
  try {
    const response = await apiService.companies.getTopCompanies();
    
    dispatch({
      type: TOP_COMPANIES_SUCCESS,
      payload: response.data.companies
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch top companies';
    
    dispatch(setAlert(errorMessage, 'error'));
    
    return null;
  }
}; 