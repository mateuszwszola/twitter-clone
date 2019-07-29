import axios from 'axios';
import {
  TWEET_LOADING,
  GET_TWEET,
  GET_TWEETS,
  CREATE_TWEET,
  REMOVE_TWEET,
  LIKE_TWEET,
  GET_ERRORS
} from './types';
import { closeCreateTweetModal } from './uiActions';
import { setAlert } from './alertActions';

export const setTweetLoading = () => ({
  type: TWEET_LOADING
});

export const setCurrentTweet = tweet => ({
  type: GET_TWEET,
  payload: tweet
});

export const getTweetById = tweet_id => async dispatch => {
  dispatch(setTweetLoading());

  try {
    const res = await axios.get(`/api/tweets/${tweet_id}`);

    dispatch({
      type: GET_TWEET,
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

export const getUserTweets = userId => async dispatch => {
  dispatch(setTweetLoading());

  try {
    const res = await axios.get(`/api/tweets/all/${userId}`);

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

export const getUserHomepageTweets = () => async dispatch => {
  dispatch(setTweetLoading());

  try {
    const res = await axios.get('/api/tweets/homepageTweets');

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

export const getUserLikeTweets = userId => async dispatch => {
  dispatch(setTweetLoading());

  try {
    const res = await axios.get(`/api/tweets/like/${userId}`);

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

export const likeTweet = tweetId => async dispatch => {
  try {
    const res = await axios.post(`/api/tweets/like/${tweetId}`);

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

export const removeTweet = tweetId => async dispatch => {
  try {
    if (window.confirm('Are you sure you want to remove this tweet?')) {
      await axios.delete(`/api/tweets/${tweetId}`);

      dispatch({
        type: REMOVE_TWEET,
        payload: tweetId
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
