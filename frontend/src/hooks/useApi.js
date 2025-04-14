import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAlert } from '../store/actions/uiActions';

/**
 * Custom hook for making API requests with built-in state management for loading, data, and errors
 * @param {string} url - The URL to fetch from
 * @param {Object} options - Configuration options
 * @param {boolean} options.fetchOnMount - Whether to fetch data when component mounts
 * @param {Object} options.initialData - Initial data state
 * @param {boolean} options.showErrorAlerts - Whether to show error alerts automatically
 * @returns {Object} - API request state and control functions
 */
const useApi = (url, {
  fetchOnMount = false,
  initialData = null,
  showErrorAlerts = true,
  baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api'
} = {}) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  // Create a local axios instance with auth token
  const api = useCallback(() => {
    const instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add token to request if available
    const token = localStorage.getItem('token');
    if (token) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return instance;
  }, [baseURL]);

  /**
   * Execute a GET request
   * @param {Object} params - Query parameters
   * @param {Object} config - Axios request config
   * @returns {Promise<Object>} - The response data
   */
  const get = useCallback(async (params = {}, config = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api().get(url, {
        params,
        ...config
      });
      
      const responseData = response.data;
      setData(responseData);
      return responseData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      
      if (showErrorAlerts) {
        dispatch(setAlert(errorMessage, 'error'));
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, dispatch, showErrorAlerts, api]);

  /**
   * Execute a POST request
   * @param {Object} payload - Data to send
   * @param {Object} config - Axios request config
   * @returns {Promise<Object>} - The response data
   */
  const post = useCallback(async (payload, config = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api().post(url, payload, config);
      
      const responseData = response.data;
      setData(responseData);
      return responseData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      
      if (showErrorAlerts) {
        dispatch(setAlert(errorMessage, 'error'));
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, dispatch, showErrorAlerts, api]);

  /**
   * Execute a PUT request
   * @param {Object} payload - Data to send
   * @param {Object} config - Axios request config
   * @returns {Promise<Object>} - The response data
   */
  const put = useCallback(async (payload, config = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api().put(url, payload, config);
      
      const responseData = response.data;
      setData(responseData);
      return responseData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      
      if (showErrorAlerts) {
        dispatch(setAlert(errorMessage, 'error'));
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, dispatch, showErrorAlerts, api]);

  /**
   * Execute a DELETE request
   * @param {Object} config - Axios request config
   * @returns {Promise<Object>} - The response data
   */
  const remove = useCallback(async (config = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api().delete(url, config);
      
      const responseData = response.data;
      setData(responseData);
      return responseData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      
      if (showErrorAlerts) {
        dispatch(setAlert(errorMessage, 'error'));
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, dispatch, showErrorAlerts, api]);

  /**
   * Reset the hook state
   */
  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  // Fetch data on component mount if enabled
  useEffect(() => {
    if (fetchOnMount) {
      get();
    }
  }, [fetchOnMount, get]);

  return {
    data,
    loading,
    error,
    get,
    post,
    put,
    delete: remove,
    reset
  };
};

export default useApi; 