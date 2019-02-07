import {
  GET_CURRENT_TWEET,
  CLEAR_CURRENT_TWEET,
  TWEET_LOADING,
  GET_TWEETS
} from '../actions/types';

const initialState = {
  tweet: null,
  tweets: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TWEET_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_CURRENT_TWEET:
      return {
        ...state,
        tweet: action.payload,
        loading: false
      };
    case CLEAR_CURRENT_TWEET:
      return {
        ...state,
        tweet: null
      };
    case GET_TWEETS:
      return {
        ...state,
        tweets: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
