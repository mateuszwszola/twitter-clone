import {
  GET_PROFILE,
  CLEAR_PROFILE,
  GET_PROFILES,
  CLEAR_PROFILES,
  PROFILE_LOADING,
  UPDATE_PROFILE,
  CREATE_TWEET,
  FOLLOW,
  UNFOLLOW,
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
    case CLEAR_PROFILES:
      return {
        ...state,
        profiles: null
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null
      };
    case FOLLOW:
      const { authUserId, userId } = payload;

      return {
        ...state,
        profiles: state.profiles.map(profile =>
          profile.user === userId
            ? {
                ...profile,
                followers: [...profile.followers, authUserId]
              }
            : profile
        ),
        profile:
          state.profile.user === authUserId
            ? {
                ...state.profile,
                following: [state.profile.following, userId]
              }
            : state.profile
      };
    case UNFOLLOW:
      const { authUserId, userId } = payload;

      return {
        ...state,
        profiles: state.profiles.map(profile =>
          profile.user === userId
            ? {
                ...profile,
                followers: profile.followers.filter(
                  follower => follower !== authUserId
                )
              }
            : profile
        ),
        profile:
          state.profile.user === authUserId
            ? {
                ...state.profile,
                following: state.profile.following.filter(
                  user => user !== userId
                )
              }
            : state.profile
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
