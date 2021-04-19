import axios from 'axios';
import jwtDecode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';
import {
  USER_LOADED,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  GET_ERRORS,
  AUTH_ERROR,
  CLEAR_PROFILE,
} from './types';

export const loadUser = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  setAuthToken(token);

  if (!token) {
    return dispatch(logoutUser());
  }

  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    dispatch(logoutUser());
    window.location.href = '/signin';
  } else {
    try {
      const res = await axios.get(`/api/users/${decoded.sub}`);

      dispatch({
        type: USER_LOADED,
        payload: res.data.user,
      });
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
      });
    }
  }
};

export const registerUser = (userData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify(userData);

  try {
    const res = await axios.post('/api/auth/register', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors || [],
    });

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

export const loginUser = (userData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify(userData);

  try {
    const res = await axios.post('/api/auth/login', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.message || [],
    });

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

export const logoutUser = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};

export const deleteAccount = (userId) => async (dispatch) => {
  try {
    if (window.confirm('Are you sure? This action cannot be undone!')) {
      await axios.delete(`/api/users/${userId}`);

      dispatch({ type: LOGOUT });
      dispatch({ type: CLEAR_PROFILE });
    }
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors || [],
    });
  }
};
