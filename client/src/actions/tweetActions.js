import axios from 'axios';
import { GET_ERRORS, TWEET_LOADING, GET_TWEETS } from './types';

export const getTweetsByUserId = user_id => dispatch => {
  dispatch(setTweetLoading());
  axios
    .get(`/api/tweets/all/${user_id}`)
    .then(res =>
      dispatch({
        type: GET_TWEETS,
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

export const getProfileHomepageTweets = () => dispatch => {
  dispatch(setTweetLoading());
  axios
    .get('/api/profiles/homepageTweets/all')
    .then(res =>
      dispatch({
        type: GET_TWEETS,
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

export const setTweetLoading = () => {
  return {
    type: TWEET_LOADING
  };
};
