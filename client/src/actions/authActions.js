import axios from 'axios';
// import setAuthToken from '../utils/setAuthToken';

import {
  USER_LOADED,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  // CLEAR_PROFILE,
  GET_ERRORS,
  AUTH_ERROR
} from './types';

// Load user
export const loadUser = () => async dispatch => {
  // if (localStorage.getItem('token')) {
  // setAuthToken(localStorage.getItem('token'));
  // }
  try {
    const res = await axios.get('/api/users/current');

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register user
export const registerUser = userData => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify(userData); /**/

  try {
    const res = await axios.post('/api/users/register', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Login User
export const loginUser = userData => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify(userData);

  try {
    const res = await axios.post('/api/users/login', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
    dispatch({
      type: LOGIN_FAIL
    });
  }
};

export const logoutUser = () => dispatch => {
  // dispatch({ type: CLEAR_PROFILE }); TODO: When user logs out, but they view user profile, I do not want to clear it
  dispatch({ type: LOGOUT });
};
