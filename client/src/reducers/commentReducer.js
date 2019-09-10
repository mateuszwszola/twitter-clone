import {
    COMMENT_LOADING,
    ADD_COMMENT,
    GET_COMMENTS,
    CLEAR_COMMENTS,
    REMOVE_TWEET,
} from "actions/types";

const initialState = {
    comments: null,
    loading: false
};

export default function(state = initialState, action) {
    const { type, payload } = action;
    const { comments } = state;

    switch(type) {
        case COMMENT_LOADING:
            return {
                ...state,
                loading: true
            };
        case ADD_COMMENT:
            return {
                ...state,
                comments: comments !== null ? [payload, ...comments] : null,
            };
        case GET_COMMENTS:
            return {
                ...state,
                comments: payload,
                loading: false
            };
        case CLEAR_COMMENTS:
            return {
                ...state,
                comments: null
            };
        case REMOVE_TWEET:
            return {
                ...state,
                comments: comments !== null
                    ? comments.filter(comment => comment._id !== payload)
                    : comments,
            };
        default:
            return state;
    }
}