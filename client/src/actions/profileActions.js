import axios from 'axios';
import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_LOADING,
  FOLLOW,
  UNFOLLOW,
  GET_ERRORS,
  GET_TWEETS,
  LOGOUT,
  CLEAR_PROFILE
} from './types';
import { setTweetLoading } from './tweetActions';
import { clearErrors } from './errorActions';
import { setAlert } from './alertActions';

export const getUserProfile = () => async dispatch => {
  dispatch(setProfileLoading());

  try {
    const res = await axios.get('/api/profiles');

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors
    });
  }
};

export const getProfiles = () => async dispatch => {
  dispatch(setProfileLoading());

  try {
    const res = await axios.get('/api/profiles/all');

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors || []
    });
  }
};

export const updateProfile = data => async dispatch => {
  dispatch(setProfileLoading());

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const body = JSON.stringify(data);
    const res = await axios.post('/api/profiles', body, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch(clearErrors());
    dispatch(setAlert('Profile successfully updated', 'success'));
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors
    });

    dispatch(setAlert('Cannot update the profile', 'danger'));
  }
};

export const followProfile = (authUserId, userId) => async dispatch => {
  try {
    await axios.post(`/api/profiles/follow/${userId}`);

    dispatch({
      type: FOLLOW,
      payload: { authUserId, userId }
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors || []
    });
  }
};

export const unfollowProfile = (authUserId, userId) => async dispatch => {
  try {
    await axios.post(`/api/profiles/unfollow/${userId}`);

    dispatch({
      type: UNFOLLOW,
      payload: { authUserId, userId }
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors || []
    });
  }
};

export const getProfileFollowers = userId => async dispatch => {
  dispatch(setProfileLoading());

  try {
    const res = await axios.get(`/api/profiles/follow/${userId}/followers`);

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors || []
    });
  }
};

export const getProfileFollowing = userId => async dispatch => {
  dispatch(setProfileLoading());

  try {
    const res = await axios.get(`/api/profiles/follow/${userId}/following`);

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors || []
    });
  }
};

export const getUserProfileWithHomepageTweets = () => async dispatch => {
  dispatch(setProfileLoading());
  dispatch(setTweetLoading());

  try {
    const res = await axios.get('/api/profiles/homepageTweets');

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch({
      type: GET_TWEETS,
      payload: res.data.homepageTweets || []
    });

    dispatch(clearErrors());
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors || []
    });
  }
};

export const getUserProfileWithTweets = () => async dispatch => {
  dispatch(setProfileLoading());
  dispatch(setTweetLoading());

  try {
    const res = await axios.get('/api/profiles/tweets');

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch({
      type: GET_TWEETS,
      payload: res.data.tweets || []
    });

    dispatch(clearErrors());
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors || []
    });
  }
};

export const getProfileByUsername = username => async dispatch => {
  dispatch(setProfileLoading());

  try {
    const res = await axios.get(`/api/profiles/username/${username}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
    dispatch(clearErrors());
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors || []
    });
  }
};

export const getProfileWithTweetsByUsername = username => async dispatch => {
  dispatch(setProfileLoading());
  dispatch(setTweetLoading());

  try {
    const res = await axios.get(`/api/profiles/username/${username}/tweets`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch({
      type: GET_TWEETS,
      payload: res.data.tweets || []
    });

    dispatch(clearErrors());
  } catch (error) {
    dispatch({
      type: GET_ERRORS,
      payload: error.response.data.errors || []
    });
  }
};

export const deleteAccount = () => async dispatch => {
  try {
    if (window.confirm('Are you sure? This action cannot be undone!')) {
      await axios.delete('/api/profiles');

      dispatch({ type: LOGOUT });
      dispatch({ type: CLEAR_PROFILE });
    }
  } catch(err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors || []
    })
  }
};

export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};
