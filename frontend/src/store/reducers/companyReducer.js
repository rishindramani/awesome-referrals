import {
  COMPANIES_LOADING,
  COMPANIES_SUCCESS,
  COMPANIES_ERROR,
  COMPANY_DETAIL_LOADING,
  COMPANY_DETAIL_SUCCESS,
  COMPANY_DETAIL_ERROR,
  TOP_COMPANIES_SUCCESS
} from '../actions/actionTypes';

const initialState = {
  companies: [],
  topCompanies: [],
  company: null,
  loading: false,
  detailLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0
  }
};

const companyReducer = (state = initialState, action) => {
  switch (action.type) {
    case COMPANIES_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case COMPANIES_SUCCESS:
      return {
        ...state,
        companies: action.payload.companies,
        pagination: action.payload.pagination,
        loading: false,
        error: null
      };
    
    case COMPANIES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case COMPANY_DETAIL_LOADING:
      return {
        ...state,
        detailLoading: true,
        error: null
      };
    
    case COMPANY_DETAIL_SUCCESS:
      return {
        ...state,
        company: action.payload,
        detailLoading: false,
        error: null
      };
    
    case COMPANY_DETAIL_ERROR:
      return {
        ...state,
        detailLoading: false,
        error: action.payload
      };
    
    case TOP_COMPANIES_SUCCESS:
      return {
        ...state,
        topCompanies: action.payload
      };
    
    default:
      return state;
  }
};

export default companyReducer; 