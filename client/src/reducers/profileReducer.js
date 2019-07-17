import {
  GET_PROFILE,
  CLEAR_PROFILE,
  GET_PROFILES,
  PROFILE_LOADING,
  UPDATE_PROFILE,
  CREATE_TWEET,
  FOLLOW,
  GET_ERRORS,
  REMOVE_TWEET
} from 'actions/types';

const initialState = {
  profile: null,
  profiles: null,
  loading: false
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        loading: false
      };
    case CREATE_TWEET:
      const updatedProfile = {
        ...state.profile,
        tweets: [payload, ...state.profile.tweets]
      };
      return {
        ...state,
        profile: updatedProfile
      };
    case FOLLOW:
      return {
        ...state,
        profile: payload
      };
    case GET_ERRORS:
      return {
        ...state,
        loading: false
      };
    case REMOVE_TWEET:
      const { tweet_id } = payload;
      const newTweets = state.profile.tweets.filter(
        tweet => tweet._id !== tweet_id
      );
      const newHomepageTweets = state.profile.homepageTweets.filter(
        tweet => tweet._id !== tweet_id
      );
      return {
        ...state,
        profile: {
          ...state.profile,
          tweets: newTweets,
          homepageTweets: newHomepageTweets
        }
      };
    default:
      return state;
  }
}
