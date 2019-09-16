import commentReducer from "reducers/commentReducer";
import {
    COMMENT_LOADING,
    ADD_COMMENT,
    GET_COMMENTS,
    CLEAR_COMMENTS,
} from "actions/types";

import { dummyTweet, dummyTweets } from '__fixtures__';

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
        test('add a comment', () => {
           const action = { type: ADD_COMMENT, payload: dummyTweet };

           const currentState = {
               ...initialState,
               comments: dummyTweets
           };

           const expectedState = {
               ...currentState,
               comments: [action.payload, ...currentState.comments]
           };

           expect(commentReducer(currentState, action)).toEqual(expectedState);
        });
    });
});