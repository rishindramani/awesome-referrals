import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

// Reducers
import authReducer from './reducers/authReducer';
import jobReducer from './reducers/jobReducer';
import referralReducer from './reducers/referralReducer';
import uiReducer from './reducers/uiReducer';
import statsReducer from './reducers/statsReducer';
import notificationReducer from './reducers/notificationReducer';
import companyReducer from './reducers/companyReducer';
import messageReducer from './reducers/messageReducer';
import recommendationReducer from './reducers/recommendationReducer';

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  jobs: jobReducer,
  referrals: referralReducer,
  ui: uiReducer,
  stats: statsReducer,
  notifications: notificationReducer,
  companies: companyReducer,
  messages: messageReducer,
  recommendations: recommendationReducer
});

// Create store with middleware
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store; 