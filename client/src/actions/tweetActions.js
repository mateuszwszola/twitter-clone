import axios from 'axios';
import {
  TWEET_LOADING,
  GET_TWEETS,
  CREATE_TWEET,
  GET_ERRORS,
  GET_CURRENT_TWEET,
  LIKE_TWEET,
  REMOVE_TWEET
} from './types';
import { closeCreateTweetModal } from './uiActions';
import { setAlert } from './alertActions';

export const setCurrentTweet = tweet => ({
  type: GET_CURRENT_TWEET,
  payload: tweet
});

export const likeTweet = tweet_id => async dispatch => {
  try {
    const res = await axios.post(`/api/tweets/like/${tweet_id}`);

    dispatch({
      type: LIKE_TWEET,
      payload: {
        tweet_id,
        updatedTweet: res.data
      }
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

export const removeTweet = tweet_id => async dispatch => {
  try {
    if (window.confirm('Are you sure you want to remove this tweet?')) {
      await axios.delete(`/api/tweets/${tweet_id}`);
      dispatch({
        type: REMOVE_TWEET,
        payload: tweet_id
      });
      dispatch(setAlert('Tweet successfully deleted', 'success'));
    }
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

export const getTweetById = tweet_id => async dispatch => {
  dispatch(setTweetLoading());

  try {
    const res = await axios.get(`/api/tweets/${tweet_id}`);

    dispatch({
      type: GET_CURRENT_TWEET,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

export const createTweet = tweet => async dispatch => {
  dispatch(setTweetLoading());

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify(tweet);

  try {
    const res = await axios.post('/api/tweets', body, config);

    dispatch({
      type: CREATE_TWEET,
      payload: res.data
    });

    dispatch(closeCreateTweetModal());
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

export const getTweetsByUserId = user_id => async dispatch => {
  dispatch(setTweetLoading());

  try {
    const res = await axios.get(`/api/tweets/all/${user_id}`);

    dispatch({
      type: GET_TWEETS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

export const getProfileHomepageTweets = () => async dispatch => {
  dispatch(setTweetLoading());

  try {
    const res = await axios.get('/api/profiles/homepageTweets/all');

    dispatch({
      type: GET_TWEETS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

export const setTweetLoading = () => ({
  type: TWEET_LOADING
});
