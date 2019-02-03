import axios from 'axios';
import { GET_ERRORS, SET_CURRENT_PROFILE } from './types';

export const fetchUserProfile = () => dispatch => {
  axios
    .get('/api/profiles')
    .then(res =>
      dispatch({
        action: SET_CURRENT_PROFILE,
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
  axios
    .get(`/api/profiles/profile/${username}`)
    .then(res =>
      dispatch({
        action: SET_CURRENT_PROFILE,
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
