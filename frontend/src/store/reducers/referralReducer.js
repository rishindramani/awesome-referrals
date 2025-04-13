import {
  REFERRALS_LOADING,
  REFERRALS_SUCCESS,
  REFERRALS_ERROR,
  REFERRAL_DETAIL_LOADING,
  REFERRAL_DETAIL_SUCCESS,
  REFERRAL_DETAIL_ERROR,
  REFERRAL_CREATE_LOADING,
  REFERRAL_CREATE_SUCCESS,
  REFERRAL_CREATE_ERROR,
  REFERRAL_UPDATE_LOADING,
  REFERRAL_UPDATE_SUCCESS,
  REFERRAL_UPDATE_ERROR,
  REFERRAL_NOTE_ADD_SUCCESS
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
    case REFERRALS_LOADING:
    case REFERRAL_DETAIL_LOADING:
    case REFERRAL_CREATE_LOADING:
    case REFERRAL_UPDATE_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
        success: false
      };
    
    case REFERRALS_SUCCESS:
      return {
        ...state,
        referrals: action.payload.referrals || action.payload,
        totalReferrals: action.payload.pagination?.totalItems || action.payload.length || 0,
        currentPage: action.payload.pagination?.page || 1,
        totalPages: action.payload.pagination?.totalPages || 1,
        loading: false,
        error: null
      };
    
    case REFERRAL_DETAIL_SUCCESS:
      return {
        ...state,
        referral: action.payload,
        loading: false,
        error: null
      };
    
    case REFERRAL_CREATE_SUCCESS:
      return {
        ...state,
        referrals: [action.payload, ...state.referrals],
        loading: false,
        error: null,
        success: true
      };
    
    case REFERRAL_UPDATE_SUCCESS:
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
    
    case REFERRAL_NOTE_ADD_SUCCESS:
      return {
        ...state,
        referral: {
          ...state.referral,
          notes: [...(state.referral.notes || []), action.payload]
        },
        loading: false,
        success: true
      };
    
    case REFERRALS_ERROR:
    case REFERRAL_DETAIL_ERROR:
    case REFERRAL_CREATE_ERROR:
    case REFERRAL_UPDATE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };
    
    default:
      return state;
  }
};

export default referralReducer; 