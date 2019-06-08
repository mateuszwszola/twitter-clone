import axios from 'axios';
import { TWEET_LOADING, GET_TWEETS, CREATE_TWEET, GET_ERRORS } from './types';

export const createTweet = tweet => async dispatch => {
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

export const setTweetLoading = () => {
  return {
    type: TWEET_LOADING
  };
};
