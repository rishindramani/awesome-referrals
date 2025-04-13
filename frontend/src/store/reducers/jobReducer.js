import {
  FETCH_JOBS_START,
  FETCH_JOBS_SUCCESS,
  FETCH_JOBS_FAIL,
  FETCH_JOB_DETAILS_START,
  FETCH_JOB_DETAILS_SUCCESS,
  FETCH_JOB_DETAILS_FAIL,
  CLEAR_JOB_DETAILS
} from '../actions/actionTypes';

const initialState = {
  jobs: [],
  job: null,
  loading: false,
  error: null,
  totalJobs: 0,
  currentPage: 1,
  totalPages: 1,
  filters: {
    location: '',
    jobType: '',
    experienceLevel: '',
    companyId: '',
    keyword: ''
  }
};

const jobReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_JOBS_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case FETCH_JOBS_SUCCESS:
      return {
        ...state,
        jobs: action.payload.jobs,
        totalJobs: action.payload.totalJobs,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        loading: false,
        error: null
      };
    
    case FETCH_JOBS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case FETCH_JOB_DETAILS_START:
      return {
        ...state,
        job: null,
        loading: true,
        error: null
      };
    
    case FETCH_JOB_DETAILS_SUCCESS:
      return {
        ...state,
        job: action.payload,
        loading: false,
        error: null
      };
    
    case FETCH_JOB_DETAILS_FAIL:
      return {
        ...state,
        job: null,
        loading: false,
        error: action.payload
      };
    
    case CLEAR_JOB_DETAILS:
      return {
        ...state,
        job: null
      };
    
    default:
      return state;
  }
};

export default jobReducer; 