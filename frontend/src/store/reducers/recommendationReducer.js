import {
  RECOMMENDATION_LOADING,
  RECOMMENDATION_ERROR,
  SET_JOB_RECOMMENDATIONS,
  SET_REFERRER_RECOMMENDATIONS,
  SET_TRENDING_JOBS,
  SET_PERSONALIZED_FEED,
  SET_RECOMMENDATION_INSIGHTS,
  CLEAR_RECOMMENDATIONS
} from '../actions/recommendationActions';

const initialState = {
  loading: false,
  error: null,
  jobRecommendations: {
    recommendations: [],
    total: 0,
    algorithm: null
  },
  referrerRecommendations: {
    recommendations: [],
    total: 0,
    jobId: null,
    algorithm: null
  },
  trendingJobs: {
    trendingJobs: [],
    total: 0,
    timeframe: null,
    algorithm: null
  },
  personalizedFeed: {
    feed: [],
    total: 0,
    composition: {},
    algorithm: null
  },
  insights: {
    topSkills: [],
    preferredLocations: [],
    averageScore: 0,
    improvementSuggestions: []
  },
  lastUpdated: null
};

const recommendationReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECOMMENDATION_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };

    case RECOMMENDATION_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case SET_JOB_RECOMMENDATIONS:
      return {
        ...state,
        loading: false,
        error: null,
        jobRecommendations: action.payload,
        lastUpdated: new Date().toISOString()
      };

    case SET_REFERRER_RECOMMENDATIONS:
      return {
        ...state,
        loading: false,
        error: null,
        referrerRecommendations: action.payload,
        lastUpdated: new Date().toISOString()
      };

    case SET_TRENDING_JOBS:
      return {
        ...state,
        loading: false,
        error: null,
        trendingJobs: action.payload,
        lastUpdated: new Date().toISOString()
      };

    case SET_PERSONALIZED_FEED:
      return {
        ...state,
        loading: false,
        error: null,
        personalizedFeed: action.payload,
        lastUpdated: new Date().toISOString()
      };

    case SET_RECOMMENDATION_INSIGHTS:
      return {
        ...state,
        loading: false,
        error: null,
        insights: action.payload,
        lastUpdated: new Date().toISOString()
      };

    case CLEAR_RECOMMENDATIONS:
      return {
        ...initialState
      };

    default:
      return state;
  }
};

export default recommendationReducer;