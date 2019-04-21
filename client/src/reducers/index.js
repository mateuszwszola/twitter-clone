import { combineReducers } from 'redux';
import authReducer from './authReducer';
import profileReducer from './profileReducer';
import tweetReducer from './tweetReducer';
import errorReducer from './errorReducer';
import uiReducer from './uiReducer';

export default combineReducers({
  auth: authReducer,
  profile: profileReducer,
  tweet: tweetReducer,
  errors: errorReducer,
  UI: uiReducer
});
