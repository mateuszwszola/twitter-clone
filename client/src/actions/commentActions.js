import axios from 'axios';
import {
    COMMENT_LOADING,
    ADD_COMMENT,
    GET_COMMENTS,
    GET_ERRORS,
    REMOVE_COMMENT,
    TOGGLE_COMMENT_LIKE
} from './types';
import { setAlert } from './alertActions';

export const setCommentLoading = () => ({
    type: COMMENT_LOADING
});

export const getComments = tweetId => async dispatch => {
    dispatch(setCommentLoading());

    try {
        const res = await axios.get(`/api/comments/${tweetId}`);

        dispatch({
            type: GET_COMMENTS,
            payload: res.data
        });
    } catch(err) {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data.errors || []
        });
    }
};

export const addComment = (tweetId, comment) => async dispatch => {
    dispatch(setCommentLoading());

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify(comment);

    try {
        const res = await axios.post(`/api/comments/${tweetId}`, body, config);

        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        });
        dispatch(setAlert('Comment successfully added', 'success'));
    } catch(err) {
        dispatch(setAlert('There was an error. Cannot add a comment', 'danger'));
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data.errors || []
        });
    }
};

export const removeComment = (commentId) => async dispatch => {
    try {
        await axios.delete(`/api/comments/comment/${commentId}`);

        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        });
        dispatch(setAlert('Comment successfully removed', 'success'));
    } catch(err) {
        dispatch(setAlert('Comment cannot be removed', 'danger'));
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data.errors || []
        });
    }
};

export const toggleCommentLike = (commentId, authUserId) => async dispatch => {
  try {
      await axios.post(`/api/comments/like/${commentId}`);

      dispatch({
          type: TOGGLE_COMMENT_LIKE,
          payload: {
              commentId,
              authUserId
          }
      });
  } catch(err) {
      dispatch({
          type: GET_ERRORS,
          payload: err.response.data.errors || []
      });
  }
};

