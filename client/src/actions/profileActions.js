import axios from 'axios';
import {
  GET_ERRORS,
  GET_CURRENT_PROFILE,
  PROFILE_LOADING,
  GET_TWEETS,
  TWEET_LOADING
} from './types';

export const getUserProfile = () => async dispatch => {
  dispatch(setProfileLoading());

  try {
    const res = await axios.get('/api/profiles');

    dispatch({
      type: GET_CURRENT_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

export const getUserProfileWithHomepageTweets = () => async dispatch => {
  dispatch(setProfileLoading());

  try {
    const res = await axios.get('/api/profiles/homepageTweets');

    dispatch({
      type: GET_CURRENT_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

export const getUserProfileWithTweets = () => async dispatch => {
  dispatch(setProfileLoading());

  try {
    const res = await axios.get('/api/profiles/tweets');

    dispatch({
      type: GET_CURRENT_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

export const getProfileByUsername = username => async dispatch => {
  dispatch(setProfileLoading());

  try {
    const res = await axios.get(`/api/profiles/profile/${username}`);

    dispatch({
      type: GET_CURRENT_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

export const fetchProfileWithTweets = username => async dispatch => {
  dispatch(setProfileLoading());

  try {
    const res = await axios.get(`/api/profiles/profile/${username}`);
    dispatch({
      type: GET_CURRENT_PROFILE,
      payload: res.data
    });
    dispatch({ type: TWEET_LOADING });
    const tweetRes = await axios.get(`/api/tweets/all/${res.data.user._id}`);
    dispatch({
      type: GET_TWEETS,
      payload: tweetRes.data
    });
  } catch (error) {
    dispatch({
      type: GET_ERRORS,
      payload: error.response.data
    });
  }
};

export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};
