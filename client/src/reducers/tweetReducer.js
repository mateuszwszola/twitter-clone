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
    case LIKE_TWEET:
      const { tweetId, authUserId } = payload;
      const tweetIndex = state.tweets && state.tweets.findIndex(tweet => tweet._id === tweetId);
      const { tweet, tweets } = state;

      return {
        ...state,
        tweets: tweets && tweetIndex > -1 ? [
          ...tweets.slice(0, tweetIndex),
          {
            ...tweets[tweetIndex],
            likes: tweets[tweetIndex].likes.includes(authUserId)
                ? tweets[tweetIndex].likes.filter(id => id !== authUserId)
                : [...tweets[tweetIndex].likes, authUserId]
          },
          ...tweets.slice(tweetIndex + 1)
        ] : tweets,
        tweet: tweet !== null && tweet._id === tweetId ? {
          ...tweet,
          likes: tweet.likes.includes(authUserId)
            ? tweet.likes.filter(id => id !== authUserId)
              : [...tweet.likes, authUserId]
        } : tweet
      };
    case REMOVE_TWEET:
      return {
        ...state,
        tweets:
          state.tweets !== null
            ? state.tweets.filter(tweet => tweet._id !== payload)
            : state.tweets,
        tweet: state.tweet && state.tweet._id === payload ? null : state.tweet
      };
    case GET_ERRORS:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
}
