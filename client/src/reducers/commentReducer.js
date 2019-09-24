import {
    COMMENT_LOADING,
    ADD_COMMENT,
    GET_COMMENTS,
    CLEAR_COMMENTS,
    REMOVE_COMMENT,
    GET_ERRORS, TOGGLE_COMMENT_LIKE,
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
                comments: comments !== null ? [...comments, payload] : state.comments,
                loading: false
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
        case REMOVE_COMMENT:
            return {
                ...state,
                comments: comments !== null
                    ? comments.filter(comment => comment._id !== payload)
                    : comments,
            };
        case TOGGLE_COMMENT_LIKE:
            const likeIndex = state.comments && state.comments.findIndex(comment => comment._id === payload.commentId);

            return {
                ...state,
                comments: comments && likeIndex > -1 ? [
                    ...comments.slice(0, likeIndex),
                    {
                        ...comments[likeIndex],
                        likes: comments[likeIndex].likes.includes(payload.authUserId)
                            ? comments[likeIndex].likes.filter(id => id !== payload.authUserId)
                            : [...comments[likeIndex].likes, payload.authUserId]
                    },
                    ...comments.slice(likeIndex + 1)
                ] : comments,
            };
        case GET_ERRORS:
            return {
                ...state,
                loading: false
            };
        default:
            return state;
    }
}