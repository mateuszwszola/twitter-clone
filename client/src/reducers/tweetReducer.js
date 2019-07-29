import {
  TWEET_LOADING,
  GET_TWEET,
  CLEAR_TWEET,
  GET_TWEETS,
  CLEAR_TWEETS,
  CREATE_TWEET,
  REMOVE_TWEET,
  LIKE_TWEET,
  GET_ERRORS
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
    case GET_TWEET:
      return {
        ...state,
        tweet: payload,
        loading: false
      };
    case CLEAR_TWEET:
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
    case CLEAR_TWEETS:
      return {
        ...state,
        tweets: null
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
      const { tweetId, updatedTweet } = payload;
      const tweetIndex = state.tweets.findIndex(tweet => tweet._id === tweetId);
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
        tweets: state.tweets.filter(tweet => tweet._id !== payload),
        tweet: state.tweet._id === payload ? null : state.tweet
      };
    default:
      return state;
  }
}
