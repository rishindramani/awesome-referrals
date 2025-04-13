import {
  FETCH_REFERRALS_START,
  FETCH_REFERRALS_SUCCESS,
  FETCH_REFERRALS_FAIL,
  FETCH_REFERRAL_DETAILS_START,
  FETCH_REFERRAL_DETAILS_SUCCESS,
  FETCH_REFERRAL_DETAILS_FAIL,
  CREATE_REFERRAL_REQUEST_START,
  CREATE_REFERRAL_REQUEST_SUCCESS,
  CREATE_REFERRAL_REQUEST_FAIL,
  UPDATE_REFERRAL_STATUS_START,
  UPDATE_REFERRAL_STATUS_SUCCESS,
  UPDATE_REFERRAL_STATUS_FAIL,
  CLEAR_REFERRAL_DETAILS,
  CLEAR_REFERRAL_ERROR
} from '../actions/actionTypes';

const initialState = {
  referrals: [],
  referral: null,
  loading: false,
  error: null,
  success: false,
  totalReferrals: 0,
  currentPage: 1,
  totalPages: 1
};

const referralReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REFERRALS_START:
    case FETCH_REFERRAL_DETAILS_START:
    case CREATE_REFERRAL_REQUEST_START:
    case UPDATE_REFERRAL_STATUS_START:
      return {
        ...state,
        loading: true,
        error: null,
        success: false
      };
    
    case FETCH_REFERRALS_SUCCESS:
      return {
        ...state,
        referrals: action.payload.referrals,
        totalReferrals: action.payload.totalReferrals,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        loading: false,
        error: null
      };
    
    case FETCH_REFERRAL_DETAILS_SUCCESS:
      return {
        ...state,
        referral: action.payload,
        loading: false,
        error: null
      };
    
    case CREATE_REFERRAL_REQUEST_SUCCESS:
      return {
        ...state,
        referrals: [action.payload, ...state.referrals],
        loading: false,
        error: null,
        success: true
      };
    
    case UPDATE_REFERRAL_STATUS_SUCCESS:
      return {
        ...state,
        referrals: state.referrals.map(referral => 
          referral.id === action.payload.id ? action.payload : referral
        ),
        referral: state.referral && state.referral.id === action.payload.id ? action.payload : state.referral,
        loading: false,
        error: null,
        success: true
      };
    
    case FETCH_REFERRALS_FAIL:
    case FETCH_REFERRAL_DETAILS_FAIL:
    case CREATE_REFERRAL_REQUEST_FAIL:
    case UPDATE_REFERRAL_STATUS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };
    
    case CLEAR_REFERRAL_DETAILS:
      return {
        ...state,
        referral: null
      };
    
    case CLEAR_REFERRAL_ERROR:
      return {
        ...state,
        error: null,
        success: false
      };
    
    default:
      return state;
  }
};

export default referralReducer; 