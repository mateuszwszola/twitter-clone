import axios from 'axios';
import { setAlert } from './alertActions';
import { clearErrors } from './errorActions';
import {
  FOLLOW,
  GET_ERRORS,
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_LOADING,
  UNFOLLOW,
} from './types';

export const getProfile = (userId) => async (dispatch) => {
  dispatch(setProfileLoading());

  try {
    const res = await axios.get(`/api/profiles/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data.profile,
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors,
    });
  }
};

export const getProfiles = (query = '') => async (dispatch) => {
  dispatch(setProfileLoading());

  try {
    const res = await axios.get(`/api/profiles${query}`);

    dispatch({
      type: GET_PROFILES,
      payload: res.data.results,
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors || [],
    });
  }
};

export const updateProfile = ({ userId, ...data }) => async (dispatch) => {
  dispatch(setProfileLoading());

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const body = JSON.stringify(data);
    const res = await axios.patch(`/api/profiles/${userId}`, body, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data.profile,
    });

    dispatch(clearErrors());
    dispatch(setAlert('Profile successfully updated', 'success'));
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors,
    });

    dispatch(setAlert('Cannot update the profile', 'danger'));
  }
};

export const followProfile = (authUserId, userId) => async (dispatch) => {
  try {
    await axios.post(`/api/profiles/follow/${userId}`);

    dispatch({
      type: FOLLOW,
      payload: { authUserId, userId },
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors || [],
    });
  }
};

export const unfollowProfile = (authUserId, userId) => async (dispatch) => {
  try {
    await axios.delete(`/api/profiles/follow/${userId}`);

    dispatch({
      type: UNFOLLOW,
      payload: { authUserId, userId },
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors || [],
    });
  }
};

export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING,
  };
};
