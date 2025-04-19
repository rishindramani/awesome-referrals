import {
  SET_STATS_LOADING,
  SET_STATS_ERROR,
  SET_USER_STATS,
  SET_REFERRAL_STATS,
  SET_JOB_STATS,
  SET_PLATFORM_STATS,
  SET_STATS_TIME_PERIOD
} from '../actions/actionTypes';

const initialState = {
  platformStats: {
    totalReferrals: 0,
    pendingReferrals: 0,
    acceptedReferrals: 0,
    successfulHires: 0,
    totalUsers: 0,
    totalCompanies: 0,
    totalJobs: 0,
    activeUsers: 0,
    jobsPostedThisMonth: 0,
    referralsThisMonth: 0
  },
  userStats: {
    totalReferralsRequested: 0,
    totalReferralsGiven: 0,
    pendingReferrals: 0,
    acceptedReferrals: 0,
    rejectedReferrals: 0,
    successfulHires: 0,
    responseRate: 0,
    averageResponseTime: 0,
    savedJobs: 0
  },
  referralStats: {
    byStatus: [],
    byCompany: [],
    byTime: [],
    successRate: 0
  },
  jobStats: {
    byCategory: [],
    byLocation: [],
    byCompany: [],
    mostViewed: [],
    mostRequested: []
  },
  timePeriod: 'all', // 'week', 'month', 'year', 'all'
  loading: false,
  error: null
};

const statsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_STATS_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case SET_STATS_ERROR:
      return {
        ...state,
        loading: false,
        error: payload
      };
    
    case SET_USER_STATS:
      return {
        ...state,
        userStats: payload,
        loading: false
      };
    
    case SET_REFERRAL_STATS:
      return {
        ...state,
        referralStats: payload,
        loading: false
      };
    
    case SET_JOB_STATS:
      return {
        ...state,
        jobStats: payload,
        loading: false
      };
    
    case SET_PLATFORM_STATS:
      return {
        ...state,
        platformStats: payload,
        loading: false
      };
    
    case SET_STATS_TIME_PERIOD:
      return {
        ...state,
        timePeriod: payload
      };
    
    default:
      return state;
  }
};

export default statsReducer; 