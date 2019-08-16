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
        profile: updateProfileFollow(state, type, payload)
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
        profile: updateProfileFollow(state, type, payload)
      };
    case CREATE_TWEET:
      return {
        ...state,
        profile:
          state.profile !== null && state.profile.user._id === payload.user._id
            ? {
                ...state.profile,
                tweets: [payload._id, ...state.profile.tweets]
              }
            : state.profile
      };
    case REMOVE_TWEET:
      const newTweets = state.profile.tweets.filter(id => id !== payload);
      const newHomepageTweets = state.profile.homepageTweets.filter(
        id => id !== payload
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

function updateProfileFollow(state, type, payload) {
  let profile = state.profile;

  if (state.profile !== null) {
    if (state.profile.user._id === payload.userId) {
      // Your current profile state is the user you followed, update followers
      profile = {
        ...profile,
        followers:
          type === FOLLOW
            ? [...profile.followers, payload.authUserId]
            : profile.followers.filter(
                follower => follower !== payload.authUserId
              )
      };
    }
    if (state.profile.user._id === payload.authUserId) {
      // Your current profile state is the auth user, update following
      profile = {
        ...profile,
        following:
          type === FOLLOW
            ? [...profile.following, payload.userId]
            : profile.following.filter(follow => follow !== payload.userId)
      };
    }
  }

  return profile;
}
