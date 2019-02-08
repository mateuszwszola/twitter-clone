import axios from 'axios';
import {
  GET_ERRORS,
  GET_CURRENT_PROFILE,
  PROFILE_LOADING,
  GET_TWEETS,
  TWEET_LOADING
} from './types';

export const fetchUserProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get('/api/profiles')
    .then(res =>
      dispatch({
        type: GET_CURRENT_PROFILE,
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
        type: GET_CURRENT_PROFILE,
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
        type: GET_CURRENT_PROFILE,
        payload: res.data
      });

      dispatch({ type: TWEET_LOADING });
      axios.get(`/api/tweets/all/${res.data.user._id}`).then(tweetsRes =>
        dispatch({
          type: GET_TWEETS,
          payload: tweetsRes.data
        })
      );
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
