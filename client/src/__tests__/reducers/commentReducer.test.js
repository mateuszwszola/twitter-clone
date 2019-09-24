import commentReducer from "reducers/commentReducer";
import {
    COMMENT_LOADING,
    ADD_COMMENT,
    GET_COMMENTS,
    CLEAR_COMMENTS,
    REMOVE_COMMENT,
    TOGGLE_COMMENT_LIKE
} from "actions/types";

import {dummyTweet, dummyTweets, dummyUser} from '__fixtures__';

const initialState = {
  comments: null,
  loading: false
};

describe('commentReducer', () => {
   describe('INITIAL_STATE', () => {
      test('is correct', () => {
          const action = { type: 'DUMMY_ACTION' };

          expect(commentReducer(undefined, action)).toEqual(initialState);
      });
   });

    describe('COMMENT_LOADING', () => {
        test('sets the loading to true', () => {
            const action = { type: COMMENT_LOADING };
            const expectedState = {
                ...initialState,
                loading: true
            };

            expect(commentReducer(undefined, action)).toEqual(expectedState);
        });
    });

    describe('GET_COMMENTS', () => {
        test('get comments', () => {
            const action = { type: GET_COMMENTS, payload: dummyTweets };
            const expectedState = {
                ...initialState,
                comments: action.payload
            };

            expect(commentReducer(undefined, action)).toEqual(expectedState);
        });
    });

    describe('CLEAR_COMMENTS', () => {
       test('sets the comments to null', () => {
           const action = { type: CLEAR_COMMENTS };

           expect(commentReducer(undefined, action)).toEqual(initialState);
       })
    });

    describe('ADD_COMMENT', () => {
        test('adds the comment', () => {
           const action = { type: ADD_COMMENT, payload: dummyTweet };

           const currentState = {
               ...initialState,
               comments: dummyTweets
           };

           const expectedState = {
               ...currentState,
               comments: [...currentState.comments, action.payload]
           };

           expect(commentReducer(currentState, action)).toEqual(expectedState);
        });
    });

    describe('REMOVE_COMMENT', () => {
       test('removes the comment', () => {
           const action = { type: REMOVE_COMMENT, payload: dummyTweets[0]._id };
           const currentState = {
               ...initialState,
               comments: dummyTweets
           };

           const expectedState = {
               ...currentState,
               comments: [dummyTweets[1]]
           };

           expect(commentReducer(currentState, action)).toEqual(expectedState);
       });
    });

    describe('TOGGLE_COMMENT_LIKE', () => {
       test('adds a like', () => {
           const action = { type: TOGGLE_COMMENT_LIKE, payload: { commentId: dummyTweets[1]._id, authUserId: dummyUser._id } };
           const currentState = {
               ...initialState,
               comments: dummyTweets
           };

           const expectedState = {
               ...currentState,
               comments: [
                   dummyTweets[0],
                   {
                       ...dummyTweets[1],
                       likes: [dummyUser._id]
                   }
               ]
           };

           expect(commentReducer(currentState, action)).toEqual(expectedState);
       });

       test('removes a like', () => {
           const action = { type: TOGGLE_COMMENT_LIKE, payload: { commentId: dummyTweets[1]._id, authUserId: dummyUser._id } };
           const currentState = {
               ...initialState,
               comments: [
                   dummyTweets[0],
                   {
                       ...dummyTweets[1],
                       likes: [dummyUser._id]
                   }
               ]
           };

           const expectedState = {
               ...currentState,
               comments: dummyTweets
           };

           expect(commentReducer(currentState, action)).toEqual(expectedState);
       });
    });
});