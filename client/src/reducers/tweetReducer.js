import {
  TWEET_LOADING,
  GET_TWEET,
  CLEAR_TWEET,
  GET_TWEETS,
  CLEAR_TWEETS,
  CREATE_TWEET,
  REMOVE_TWEET,
  LIKE_TWEET,
  GET_ERRORS,
  ADD_COMMENT,
  REMOVE_COMMENT
} from 'actions/types';

const initialState = {
  tweet: null,
  tweets: null,
  loading: false
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  const { tweet, tweets } = state;

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
        tweets: state.tweets !== null ? payload.addNewTweetToState ? [payload.data, ...state.tweets] : [...state.tweets] : null,
        loading: false
      };
    case LIKE_TWEET:
      const likeIndex = tweets && tweets.findIndex(tweet => tweet._id === payload.tweetId);

      return {
        ...state,
        tweets: tweets && likeIndex > -1 ? [
          ...tweets.slice(0, likeIndex),
          {
            ...tweets[likeIndex],
            likes: tweets[likeIndex].likes.includes(payload.authUserId)
                ? tweets[likeIndex].likes.filter(id => id !== payload.authUserId)
                : [...tweets[likeIndex].likes, payload.authUserId]
          },
          ...tweets.slice(likeIndex + 1)
        ] : tweets,
        tweet: tweet !== null && tweet._id === payload.tweetId ? {
          ...tweet,
          likes: tweet.likes.includes(payload.authUserId)
            ? tweet.likes.filter(id => id !== payload.authUserId)
              : [...tweet.likes, payload.authUserId]
        } : tweet
      };
    case ADD_COMMENT:
      return {
        ...state,
        tweet: state.tweet !== null ? {
          ...state.tweet,
          comments: [...state.tweet.comments, payload._id]
        } : state.tweet
      };
    case REMOVE_COMMENT:
      return {
        ...state,
        tweet: state.tweet !== null ? {
          ...state.tweet,
          comments: state.tweet.comments.filter(commentId => commentId !== payload)
        } : state.tweet
      };
    // case RETWEET_TWEET:
    //   const retweetIndex = tweets && state.tweets.findIndex(tweet => tweet._id === payload.tweetId);
    //
    //   return {
    //     ...state,
    //     tweets: tweets && retweetIndex > -1 ? [
    //       ...tweets.slice(0, retweetIndex),
    //       {
    //         ...tweets[retweetIndex],
    //         retweets: tweets[retweetIndex].retweets.includes(payload.authUserId)
    //             ? tweets[retweetIndex].retweets.filter(id => id !== payload.authUserId)
    //             : [...tweets[retweetIndex].retweets, payload.authUserId]
    //       },
    //       ...tweets.slice(retweetIndex + 1)
    //     ] : tweets,
    //     tweet: tweet !== null && tweet._id === payload.tweetId ? {
    //       ...tweet,
    //       retweets: tweet.retweets.includes(payload.authUserId)
    //           ? tweet.retweets.filter(id => id !== payload.authUserId)
    //           : [...tweet.retweets, payload.authUserId]
    //     } : tweet
    //   };
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
