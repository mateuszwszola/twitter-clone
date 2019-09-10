import axios from 'axios';
import {
    COMMENT_LOADING,
    ADD_COMMENT,
    GET_COMMENTS,
    GET_ERRORS
} from "./types";

export const setCommentLoading = () => ({
    type: COMMENT_LOADING
});

export const getComments = tweetId => async dispatch => {
    dispatch(setCommentLoading());

    try {
        const res = await axios.get(`/api/tweets/comment/${tweetId}/all`);

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

export const addComment = tweetId => async dispatch => {
    try {
        const res = await axios.post(`/api/tweets/comment/${tweetId}`);

        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        });
    } catch(err) {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data.errors || []
        });
    }
};

