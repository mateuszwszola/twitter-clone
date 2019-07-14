import {
  GET_CURRENT_TWEET,
  CLEAR_CURRENT_TWEET,
  TWEET_LOADING,
  GET_TWEETS,
  CREATE_TWEET,
  GET_ERRORS,
  LIKE_TWEET,
  REMOVE_TWEET
} from 'actions/types';

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
    case GET_ERRORS:
      return {
        ...state,
        loading: false
      };
    case LIKE_TWEET:
      const { tweet_id, updatedTweet } = payload;
      const tweetIndex = state.tweets.findIndex(
        tweet => tweet._id === tweet_id
      );
      return {
        ...state,
        tweets: [
          ...state.tweets.slice(0, tweetIndex),
          updatedTweet,
          ...state.tweets.slice(tweetIndex + 1)
        ],
        tweet: updatedTweet || state.tweet
      };
    case REMOVE_TWEET:
      return {
        ...state,
        tweets: state.tweets.filter(tweet => tweet._id !== payload)
      };
    default:
      return state;
  }
}
