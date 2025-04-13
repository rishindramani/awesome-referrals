import {
  STATS_LOADING,
  STATS_SUCCESS,
  STATS_ERROR,
  USER_STATS_LOADING,
  USER_STATS_SUCCESS,
  USER_STATS_ERROR
} from '../actions/actionTypes';

const initialState = {
  platformStats: {
    totalReferrals: 0,
    pendingReferrals: 0,
    acceptedReferrals: 0,
    successfulHires: 0,
    totalUsers: 0,
    totalCompanies: 0,
    totalJobs: 0
  },
  userStats: {
    totalReferralsRequested: 0,
    totalReferralsGiven: 0,
    pendingReferrals: 0,
    acceptedReferrals: 0,
    rejectedReferrals: 0,
    successfulHires: 0
  },
  companyStats: {},
  categoryStats: [],
  loading: false,
  userStatsLoading: false,
  error: null
};

const statsReducer = (state = initialState, action) => {
  switch (action.type) {
    case STATS_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case STATS_SUCCESS:
      // Handle different types of statistics being returned
      if (action.payload.statsType === 'company') {
        return {
          ...state,
          companyStats: action.payload,
          loading: false
        };
      } else if (action.payload.statsType === 'jobCategories') {
        return {
          ...state,
          categoryStats: action.payload.categories,
          loading: false
        };
      } else {
        // Default to platform stats
        return {
          ...state,
          platformStats: action.payload,
          loading: false
        };
      }
    
    case STATS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case USER_STATS_LOADING:
      return {
        ...state,
        userStatsLoading: true,
        error: null
      };
    
    case USER_STATS_SUCCESS:
      return {
        ...state,
        userStats: action.payload,
        userStatsLoading: false
      };
    
    case USER_STATS_ERROR:
      return {
        ...state,
        userStatsLoading: false,
        error: action.payload
      };
    
    default:
      return state;
  }
};

export default statsReducer; 