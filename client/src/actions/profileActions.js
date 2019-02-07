import axios from 'axios';
import { GET_ERRORS, GET_CURRENT_PROFILE, PROFILE_LOADING } from './types';
import { getTweetsByUserId } from './tweetActions';

export const fetchUserProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get('/api/profiles')
    .then(res =>
      dispatch({
        action: GET_CURRENT_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const fetchProfile = username => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get(`/api/profiles/profile/${username}`)
    .then(res =>
      dispatch({
        action: GET_CURRENT_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const fetchProfileWithTweets = username => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get(`/api/profiles/profile/${username}`)
    .then(res => {
      dispatch({
        action: GET_CURRENT_PROFILE,
        payload: res.data
      });

      getTweetsByUserId(res.data.user._id);
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};
