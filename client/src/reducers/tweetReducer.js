import {
  GET_CURRENT_TWEET,
  CLEAR_CURRENT_TWEET,
  TWEET_LOADING,
  GET_TWEETS,
  CREATE_TWEET
} from '../actions/types';

const initialState = {
  tweet: null,
  tweets: null,
  loading: false
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case TWEET_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_CURRENT_TWEET:
      return {
        ...state,
        tweet: payload,
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
        tweets: payload,
        loading: false
      };
    case CREATE_TWEET:
      return {
        ...state,
        tweets: [payload, ...state.tweets],
        loading: false
      };
    default:
      return state;
  }
}
