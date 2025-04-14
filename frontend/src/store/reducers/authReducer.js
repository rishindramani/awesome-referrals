import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT,
  REGISTER_START,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_ERROR
} from '../actions/actionTypes';

const initialState = {
  token: localStorage.getItem('token'),
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_START:
    case REGISTER_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case AUTH_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case REGISTER_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case PROFILE_UPDATE_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null
      };
    
    case AUTH_FAIL:
    case REGISTER_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    
    case PROFILE_UPDATE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case AUTH_LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    
    default:
      return state;
  }
};

export default authReducer; 