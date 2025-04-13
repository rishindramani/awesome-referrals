import {
  JOBS_LOADING,
  JOBS_SUCCESS,
  JOBS_ERROR,
  JOB_DETAIL_LOADING,
  JOB_DETAIL_SUCCESS,
  JOB_DETAIL_ERROR,
  TOP_JOBS_SUCCESS,
  SAVE_JOB_SUCCESS
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
  },
  topJobs: [],
  savedJobs: []
};

const jobReducer = (state = initialState, action) => {
  switch (action.type) {
    case JOBS_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case JOBS_SUCCESS:
      return {
        ...state,
        jobs: action.payload.jobs,
        totalJobs: action.payload.pagination?.totalItems || 0,
        currentPage: action.payload.pagination?.page || 1,
        totalPages: action.payload.pagination?.totalPages || 1,
        loading: false,
        error: null
      };
    
    case JOBS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case JOB_DETAIL_LOADING:
      return {
        ...state,
        job: null,
        loading: true,
        error: null
      };
    
    case JOB_DETAIL_SUCCESS:
      return {
        ...state,
        job: action.payload,
        loading: false,
        error: null
      };
    
    case JOB_DETAIL_ERROR:
      return {
        ...state,
        job: null,
        loading: false,
        error: action.payload
      };
    
    case TOP_JOBS_SUCCESS:
      return {
        ...state,
        topJobs: action.payload
      };
      
    case SAVE_JOB_SUCCESS:
      return {
        ...state,
        savedJobs: action.payload.removed 
          ? state.savedJobs.filter(job => job.id !== action.payload.id)
          : [...state.savedJobs, action.payload]
      };
    
    default:
      return state;
  }
};

export default jobReducer; 