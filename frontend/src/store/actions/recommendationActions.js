import apiService from '../../services/apiService';
import { setAlert } from './uiActions';

// Action types
export const RECOMMENDATION_LOADING = 'RECOMMENDATION_LOADING';
export const RECOMMENDATION_ERROR = 'RECOMMENDATION_ERROR';
export const SET_JOB_RECOMMENDATIONS = 'SET_JOB_RECOMMENDATIONS';
export const SET_REFERRER_RECOMMENDATIONS = 'SET_REFERRER_RECOMMENDATIONS';
export const SET_TRENDING_JOBS = 'SET_TRENDING_JOBS';
export const SET_PERSONALIZED_FEED = 'SET_PERSONALIZED_FEED';
export const SET_RECOMMENDATION_INSIGHTS = 'SET_RECOMMENDATION_INSIGHTS';
export const CLEAR_RECOMMENDATIONS = 'CLEAR_RECOMMENDATIONS';

/**
 * Get personalized job recommendations
 */
export const getJobRecommendations = (options = {}) => async (dispatch) => {
  try {
    dispatch({ type: RECOMMENDATION_LOADING });
    
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.excludeApplied !== undefined) params.append('excludeApplied', options.excludeApplied);
    if (options.includeScore) params.append('includeScore', options.includeScore);
    
    const response = await apiService.get(`/recommendations/jobs?${params.toString()}`);
    
    dispatch({
      type: SET_JOB_RECOMMENDATIONS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to load job recommendations';
    
    dispatch({
      type: RECOMMENDATION_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
    return null;
  }
};

/**
 * Get referrer recommendations for a specific job
 */
export const getReferrerRecommendations = (jobId, options = {}) => async (dispatch) => {
  try {
    dispatch({ type: RECOMMENDATION_LOADING });
    
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.includeScore) params.append('includeScore', options.includeScore);
    
    const response = await apiService.get(`/recommendations/referrers/${jobId}?${params.toString()}`);
    
    dispatch({
      type: SET_REFERRER_RECOMMENDATIONS,
      payload: {
        jobId,
        ...response.data
      }
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to load referrer recommendations';
    
    dispatch({
      type: RECOMMENDATION_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
    return null;
  }
};

/**
 * Get trending jobs
 */
export const getTrendingJobs = (options = {}) => async (dispatch) => {
  try {
    dispatch({ type: RECOMMENDATION_LOADING });
    
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.timeframe) params.append('timeframe', options.timeframe);
    
    const response = await apiService.get(`/recommendations/trending?${params.toString()}`);
    
    dispatch({
      type: SET_TRENDING_JOBS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to load trending jobs';
    
    dispatch({
      type: RECOMMENDATION_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
    return null;
  }
};

/**
 * Get personalized job feed (recommendations + trending)
 */
export const getPersonalizedFeed = (options = {}) => async (dispatch) => {
  try {
    dispatch({ type: RECOMMENDATION_LOADING });
    
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.trendingWeight) params.append('trendingWeight', options.trendingWeight);
    if (options.recommendationWeight) params.append('recommendationWeight', options.recommendationWeight);
    
    const response = await apiService.get(`/recommendations/feed?${params.toString()}`);
    
    dispatch({
      type: SET_PERSONALIZED_FEED,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to load personalized feed';
    
    dispatch({
      type: RECOMMENDATION_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
    return null;
  }
};

/**
 * Get recommendation insights
 */
export const getRecommendationInsights = () => async (dispatch) => {
  try {
    dispatch({ type: RECOMMENDATION_LOADING });
    
    const response = await apiService.get('/recommendations/insights');
    
    dispatch({
      type: SET_RECOMMENDATION_INSIGHTS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to load recommendation insights';
    
    dispatch({
      type: RECOMMENDATION_ERROR,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
    return null;
  }
};

/**
 * Provide feedback on a recommendation
 */
export const provideFeedback = (jobId, feedback, reason = null) => async (dispatch) => {
  try {
    const response = await apiService.post(`/recommendations/feedback/${jobId}`, {
      feedback,
      reason
    });
    
    dispatch(setAlert('Thank you for your feedback!', 'success'));
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to submit feedback';
    
    dispatch(setAlert(errorMessage, 'error'));
    return null;
  }
};

/**
 * Clear all recommendation data
 */
export const clearRecommendations = () => ({
  type: CLEAR_RECOMMENDATIONS
});

/**
 * Refresh recommendations (get fresh data)
 */
export const refreshRecommendations = () => async (dispatch) => {
  dispatch(clearRecommendations());
  
  // Fetch fresh data
  await Promise.all([
    dispatch(getJobRecommendations({ limit: 10 })),
    dispatch(getTrendingJobs({ limit: 5 })),
    dispatch(getRecommendationInsights())
  ]);
  
  dispatch(setAlert('Recommendations refreshed!', 'success'));
};