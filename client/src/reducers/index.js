import { combineReducers } from 'redux';
import authReducer from './authReducer';
import profileReducer from './profileReducer';
import tweetReducer from './tweetReducer';
import commentReducer from './commentReducer';
import errorReducer from './errorReducer';
import uiReducer from './uiReducer';
import alertReducer from './alertReducer';

export default combineReducers({
  auth: authReducer,
  profile: profileReducer,
  tweet: tweetReducer,
  comment: commentReducer,
  errors: errorReducer,
  UI: uiReducer,
  alert: alertReducer
});
