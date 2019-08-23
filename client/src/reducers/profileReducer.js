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
            ? state.profiles.map(profile => {
                if (profile.user._id === payload.userId) {
                  return {
                    ...profile,
                    followers: [...profile.followers, payload.authUserId]
                  }
                } else if (profile.user._id === payload.authUserId) {
                  return {
                    ...profile,
                    following: [...profile.following, payload.userId]
                  }
                } else {
                  return profile;
                }
              })
            : null,
        profile: updateProfileFollow(state, type, payload)
      };
    case UNFOLLOW:
      return {
        ...state,
        loading: false,
        profiles:
          state.profiles !== null
            ? state.profiles.map(profile => {
                if (profile.user._id === payload.userId) {
                  return {
                    ...profile,
                    followers: profile.followers.filter(
                        follower => follower !== payload.authUserId
                    )
                  }
                } else if (profile.user._id === payload.authUserId) {
                  return {
                    ...profile,
                    following: profile.following.filter(
                        id => id !== payload.userId
                    )
                  }
                } else {
                  return profile;
                }
              })
            : null,
        profile: updateProfileFollow(state, type, payload)
      };
    case CREATE_TWEET:
      return {
        ...state,
        profile: updateProfileTweet(state, type, payload)
      };
    case REMOVE_TWEET:
      return {
        ...state,
        profile: state.profile !== null ? {
          ...state.profile,
          tweets: state.profile.tweets.filter(id => id !== payload),
          homepageTweets: state.profile.homepageTweets.filter(
              id => id !== payload
          )
        } : null
      };
    case GET_ERRORS:
      return {
        ...state,
        loading: false
      };
    case LIKE_TWEET:
      // Only update the state when the profile is authenticated user profile
      const alreadyLiked = state.profile && state.profile.likes.includes(payload.tweetId);
      return {
        ...state,
        profile: state.profile && state.profile.user._id === payload.authUserId ? {
          ...state.profile,
          likes:
            alreadyLiked
              ? state.profile.likes.filter(id => id !== payload.tweetId)
              : [...state.profile.likes, payload.tweetId]
        } : state.profile
      };
    default:
      return state;
  }
}

function updateProfileTweet(state, type, payload) {
  const { profile } = state;
  const tweetOwnerId = payload.user._id;
  const tweetId = payload._id;

  if (profile !== null) {
    if (profile.user._id === tweetOwnerId) {
        return {
          ...profile,
          tweets: [tweetId, ...profile.tweets],
          homepageTweets: [tweetId, ...profile.homepageTweets]
        };
    }

    if (profile.following.includes(tweetOwnerId)) {
      return {
        ...profile,
        tweets: [tweetId, ...profile.tweets]
      };
    }
  }

  return profile;
}

function updateProfileFollow(state, type, payload) {
  let profile = state.profile;
  const { authUserId, userId } = payload;

  if (state.profile !== null) {
    if (state.profile.user._id === userId) {
      // Your current profile state is the user you followed, update followers
      profile = {
        ...profile,
        followers:
          type === FOLLOW
            ? [...profile.followers, authUserId]
            : profile.followers.filter(
                follower => follower !== authUserId
              )
      };
    }
    if (state.profile.user._id === authUserId) {
      // Your current profile state is the auth user, update following
      profile = {
        ...profile,
        following:
          type === FOLLOW
            ? [...profile.following, userId]
            : profile.following.filter(follow => follow !== userId)
      };
    }
  }

  return profile;
}
