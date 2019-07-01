import axios from 'axios';
import {
  GET_ERRORS,
  GET_PROFILE,
  PROFILE_LOADING,
  GET_TWEETS
  // FOLLOW
} from './types';
import { setTweetLoading } from './tweetActions';
import { clearErrors } from './errorActions';

// export const followProfile = () => async dispatch => {
//   try {
//     const res = await axios.post()
//   } catch (err) {
//     dispatch({
//       type: GET_ERRORS,
//       payload: err.reponse.data
//     })
//   }
// }

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
      payload: err.response.data
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
      payload: err.response.data
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
      payload: err.response.data
    });
  }
};

export const getProfileByUsername = username => async dispatch => {
  dispatch(setProfileLoading());

  try {
    const res = await axios.get(`/api/profiles/profile/${username}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
    dispatch(clearErrors());
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
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
      payload: error.response.data
    });
  }
};

export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};
