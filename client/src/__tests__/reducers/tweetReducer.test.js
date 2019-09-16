import tweetReducer from "reducers/tweetReducer";
import {
    TWEET_LOADING,
    GET_TWEET,
    CLEAR_TWEET,
    GET_TWEETS,
    CLEAR_TWEETS,
    CREATE_TWEET,
    LIKE_TWEET,
    REMOVE_TWEET
} from "actions/types";
import { dummyTweet, dummyTweets, dummyProfile } from '__fixtures__';

const initialState = {
    tweet: null,
    tweets: null,
    loading: false
};

describe('tweetReducer', () => {
    describe('INITIAL_STATE', () => {
        test('is correct', () => {
            const action = { type: 'DUMMY_ACTION' };

            expect(tweetReducer(undefined, action)).toEqual(initialState);
        });
    });

    describe('TWEET_LOADING', () => {
       test('sets the tweet loading to true', () => {
            const action = { type: TWEET_LOADING };
            const expectedState = {
                ...initialState,
                loading: true
            };

            expect(tweetReducer(undefined, action)).toEqual(expectedState);
       });
    });

    describe('GET_TWEET', () => {
       test('sets the tweet to payload', () => {
           const action = { type: GET_TWEET, payload: dummyTweet };
           const expectedState = {
               ...initialState,
               tweet: action.payload,
               loading: false
           };

           expect(tweetReducer(undefined, action)).toEqual(expectedState);
       });
    });

    describe('CLEAR_TWEET', () => {
        test('sets the tweet to null', () => {
            const action = { type: CLEAR_TWEET };

            expect(tweetReducer(undefined, action)).toEqual(initialState);
        });
    });

    describe('GET_TWEETS', () => {
       test('sets the tweets to payload', () => {
           const action = { type: GET_TWEETS, payload: dummyTweets };
           const expectedState = {
               ...initialState,
               tweets: action.payload
           };

           expect(tweetReducer(undefined, action)).toEqual(expectedState);
       });
    });

    describe('CLEAR_TWEETS', () => {
        test('sets the tweets to null', () => {
            const action = { type: CLEAR_TWEETS };

            expect(tweetReducer(undefined, action)).toEqual(initialState);
        });
    });

    describe('CREATE_TWEET', () => {
        const action = {
            type: CREATE_TWEET,
            payload: {
                addNewTweetToState: false,
                data: dummyTweet
            }
        };
       test('does not add new tweet to tweets array', () => {
            expect(tweetReducer(undefined, action)).toEqual(initialState);
       });

       test('adds new tweet to tweets array', () => {
            const currentState = {
                ...initialState,
                tweets: dummyTweets
            };

            const expectedState = {
                ...currentState,
                tweets: [action.payload.data, ...currentState.tweets]
            };

            expect(tweetReducer(currentState, { ...action, payload: { ...action.payload, addNewTweetToState: true} })).toEqual(expectedState);
       });
    });

    describe('LIKE_TWEET', () => {
        const action = {
            type: LIKE_TWEET,
            payload: {
                tweetId: dummyTweet._id,
                authUserId: dummyProfile.user._id
            }
        };

        test('does not update the state when tweets and tweet are null', () => {
            expect(tweetReducer(undefined, action)).toEqual(initialState);
        });

        test('updates the tweets array by adding auth user ID to the liked tweet', () => {
            const currentState = {
                ...initialState,
                tweets: dummyTweets
            };

            const expectedState = {
                ...currentState,
                tweets: [
                    dummyTweets[0],
                    {
                        ...dummyTweets[1],
                        likes: [...dummyTweets[1].likes, action.payload.authUserId]
                    }
                ]
            };

            expect(tweetReducer(currentState, action)).toEqual(expectedState);
        });

        test('updates the tweets array by removing auth user ID from the unliked tweet', () => {
            const currentState = {
                ...initialState,
                tweets: [
                    dummyTweets[0],
                    {
                        ...dummyTweets[1],
                        likes: [...dummyTweets[1].likes, action.payload.authUserId]
                    }
                ]
            };

            const expectedState = {
                ...currentState,
                tweets: dummyTweets
            };

            expect(tweetReducer(currentState, action)).toEqual(expectedState);
        });

        test('updates the tweet by adding auth user ID to likes array', () => {
           const currentState = {
               ...initialState,
               tweet: dummyTweet
           };

           const expectedState = {
               ...currentState,
               tweet: {
                   ...dummyTweet,
                   likes: [...dummyTweet.likes, action.payload.authUserId]
               }
           };

           expect(tweetReducer(currentState, action)).toEqual(expectedState);
        });

        test('updates the tweet by removing auth user ID from likes array', () => {
            const currentState = {
                ...initialState,
                tweet: {
                    ...dummyTweet,
                    likes: [...dummyTweet.likes, action.payload.authUserId]
                }
            };

            const expectedState = {
                ...currentState,
                tweet: dummyTweet
            };

            expect(tweetReducer(currentState, action)).toEqual(expectedState);
        });
    });

    describe('REMOVE_TWEET', () => {
        const action = { type: REMOVE_TWEET, payload: dummyTweet._id };

        test('does not update state when there is not tweet to be removed', () => {
           expect(tweetReducer(undefined, action)).toEqual(initialState);
        });

        test('removes tweet from tweets array', () => {
           const currentState = {
               ...initialState,
               tweets: dummyTweets
           };

           const expectedState = {
               ...currentState,
               tweets: [dummyTweets[0]]
           };

           expect(tweetReducer(currentState, action)).toEqual(expectedState);
        });

        test('sets tweet to null when its tweet to remove', () => {
           const currentState = {
               ...initialState,
               tweet: dummyTweet
           };

           expect(tweetReducer(currentState, action)).toEqual(initialState);
        });
    });
});