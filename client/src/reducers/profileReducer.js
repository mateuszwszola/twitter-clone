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
  LIKE_TWEET,
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
      return {
        ...state,
        loading: false,
        profiles:
          state.profiles !== null
            ? state.profiles.map(profile =>
                profile.user._id === payload.userId
                  ? {
                      ...profile,
                      followers: [...profile.followers, payload.authUserId]
                    }
                  : profile
              )
            : null,
        profile: {
          ...state.profile,
          followers: [...state.profile.followers, payload.authUserId]
        }
      };
    case UNFOLLOW:
      return {
        ...state,
        loading: false,
        profiles:
          state.profiles !== null
            ? state.profiles.map(profile =>
                profile.user._id === payload.userId
                  ? {
                      ...profile,
                      followers: profile.followers.filter(
                        follower => follower !== payload.authUserId
                      )
                    }
                  : profile
              )
            : null,
        profile: {
          ...state.profile,
          followers: state.profile.followers.filter(
            user => user !== payload.authUserId
          )
        }
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
    case REMOVE_TWEET:
      const newTweets = state.profile.tweets.filter(
        tweet => tweet._id !== payload
      );
      const newHomepageTweets = state.profile.homepageTweets.filter(
        tweet => tweet._id !== payload
      );
      return {
        ...state,
        profile: {
          ...state.profile,
          tweets: newTweets,
          homepageTweets: newHomepageTweets
        }
      };
    case GET_ERRORS:
      return {
        ...state,
        loading: false
      };
    case LIKE_TWEET:
      const index = state.profile.likes.findIndex(id => id === payload.tweetId);
      return {
        ...state,
        profile: {
          ...state.profile,
          likes:
            index > -1
              ? state.profile.likes.filter(id => id !== payload.tweetId)
              : [...state.profile.likes, payload.tweetId]
        }
      };
    default:
      return state;
  }
}
