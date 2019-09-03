import profileReducer from "reducers/profileReducer";
import {
    PROFILE_LOADING,
    GET_PROFILE,
    CLEAR_PROFILE,
    GET_PROFILES,
    CLEAR_PROFILES,
    FOLLOW,
    UNFOLLOW, CREATE_TWEET, REMOVE_TWEET, LIKE_TWEET
} from "actions/types";
import { dummyProfile, dummyProfiles, dummyTweet } from '__fixtures__';

const initialState = {
    profile: null,
    profiles: null,
    loading: false
};

describe('profileReducer', () => {
    describe('INITIAL_STATE', () => {
        test('is correct', () => {
            const action = { type: 'DUMMY_ACTION' };

            expect(profileReducer(undefined, action)).toEqual(initialState);
        });
    });

    describe('PROFILE_LOADING', () => {
        test('sets the profile loading to true', () => {
            const action = { type: PROFILE_LOADING };
            const expectedState = {
                ...initialState,
                loading: true
            };

            expect(profileReducer(undefined, action)).toEqual(expectedState);
        });
    });

    describe('GET_PROFILE', () => {
        test('sets the profile, and loading to false', () => {
            const action = { type: GET_PROFILE, payload: dummyProfile };
            const expectedState = {
                ...initialState,
                profile: dummyProfile
            };

            expect(profileReducer(undefined, action)).toEqual(expectedState);
        });
    });

    describe('CLEAR_PROFILE', () => {
        test('sets the profile to null', () => {
            const action = { type: CLEAR_PROFILE };
            const expectedState = initialState;

            expect(profileReducer(undefined, action)).toEqual(expectedState);
        });
    });

    describe('GET_PROFILES', () => {
        test('sets the profiles to array of profiles', () => {
            const action = {
                type: GET_PROFILES,
                payload: dummyProfiles
            };
            const expectedState = {
               ...initialState,
                profiles: dummyProfiles
            };

            expect(profileReducer(undefined, action)).toEqual(expectedState);
        });
    });

    describe('CLEAR_PROFILES', () => {
        test('sets the profiles to null', () => {
            const action = { type: CLEAR_PROFILES };
            const expectedState = initialState;

            expect(profileReducer(undefined, action)).toEqual(expectedState);
        });
    });

    describe('FOLLOW AND UNFOLLOW', () => {
        const payload = {
            userId: dummyProfiles[0].user._id,
            authUserId: dummyProfiles[1].user._id
        };

        describe('FOLLOW', () => {
            test('does not update profile when its null', () => {
                const action = { type: FOLLOW, payload };
                expect(profileReducer(undefined, action)).toEqual(initialState);
            });

            test('does not update profiles when its null', () => {
                const action = { type: FOLLOW, payload };
                expect(profileReducer(undefined, action)).toEqual(initialState);
            });

            test('updates the profiles by adding auth user ID to followers array of followed profile and ID of followed user to auth user profile following array', () => {
                const currentState = {
                    ...initialState,
                    profiles: dummyProfiles
                };
                const action = { type: FOLLOW, payload };
                const expectedState = {
                    ...currentState,
                    profiles: [
                        {
                            ...dummyProfiles[0],
                            followers: [...dummyProfiles[0].followers, payload.authUserId]
                        },
                        {
                            ...dummyProfiles[1],
                            following: [...dummyProfiles[1].following, payload.userId]
                        }
                    ]
                };

                expect(profileReducer(currentState, action)).toEqual(expectedState);
            });

            test('updates profile followers array by adding auth user ID when current profile is the followed user', () => {
                const currentState = {
                    ...initialState,
                    profile: dummyProfiles[0]
                };
                const action = { type: FOLLOW, payload };
                const expectedState = {
                    ...currentState,
                    profile: {
                        ...dummyProfiles[0],
                        followers: [...dummyProfiles[0].followers, payload.authUserId]
                    }
                };

                expect(profileReducer(currentState, action)).toEqual(expectedState);
            });

            test('updates profile following array by adding user ID when current profile is the auth user profile', () => {
                const currentState = {
                    ...initialState,
                    profile: dummyProfiles[1]
                };
                const action = { type: FOLLOW, payload };
                const expectedState = {
                    ...currentState,
                    profile: {
                        ...dummyProfiles[1],
                        following: [...dummyProfiles[1].following, payload.userId]
                    }
                };

                expect(profileReducer(currentState, action)).toEqual(expectedState);
            });
        });

        describe('UNFOLLOW', () => {
            test('does not update profile when its null', () => {
                const action = { type: UNFOLLOW, payload };
                expect(profileReducer(undefined, action)).toEqual(initialState);
            });

            test('does not update profiles when its null', () => {
                const action = { type: UNFOLLOW, payload };
                expect(profileReducer(undefined, action)).toEqual(initialState);
            });

            test('updates the profiles by removing auth user ID from followers array of followed profile and ID of followed user from auth user profile following array', () => {
                const currentState = {
                    ...initialState,
                    profiles: [
                        {
                            ...dummyProfiles[0],
                            followers: [...dummyProfiles[0].followers, payload.authUserId]
                        },
                        {
                            ...dummyProfiles[1],
                            following: [...dummyProfiles[1].following, payload.userId]
                        }
                    ]
                };
                const action = { type: UNFOLLOW, payload };
                const expectedState = {
                    ...initialState,
                    profiles: dummyProfiles
                };

                expect(profileReducer(currentState, action)).toEqual(expectedState);
            });

            test('updates followed user profile by removing auth user ID from followers array', () => {
                const currentState = {
                    ...initialState,
                    profile: {
                        ...dummyProfiles[0],
                        followers: [...dummyProfiles[0].followers, payload.authUserId]
                    }
                };
                const action = { type: UNFOLLOW, payload };
                const expectedState = {
                    ...currentState,
                    profile: {
                        ...dummyProfiles[0],
                        followers: [...dummyProfiles[0].followers]
                    }
                };

                expect(profileReducer(currentState, action)).toEqual(expectedState);
            });

            test('updates auth user profile by removing user ID from following array', () => {
                const currentState = {
                    ...initialState,
                    profile: {
                        ...dummyProfiles[1],
                        following: [...dummyProfiles[1].following, payload.userId]
                    }
                };
                const action = { type: UNFOLLOW, payload };
                const expectedState = {
                    ...currentState,
                    profile: {
                        ...dummyProfiles[1],
                        following: [...dummyProfiles[1].following]
                    }
                };

                expect(profileReducer(currentState, action)).toEqual(expectedState);
            });
        });
    });

    describe('Creating and removing tweet', () => {
        describe('CREATE_TWEET', () => {
            const action = { type: CREATE_TWEET, payload: dummyTweet };

            test('does not update the state when profile is null', () => {
                expect(profileReducer(undefined, action)).toEqual(initialState);
            });

            test('adds tweet ID to profile tweets and homepageTweets array which user is the owner of that tweet', () => {
                const profile = dummyProfiles[1];
                const tweetId = action.payload._id;

                const currentState = {
                    ...initialState,
                    profile
                };

                const expectedState = {
                    ...currentState,
                    profile: {
                        ...profile,
                        tweets: [tweetId, ...profile.tweets],
                        homepageTweets: [tweetId, ...profile.homepageTweets]
                    }
                };

                expect(profileReducer(currentState, action)).toEqual(expectedState);
            });

            test('adds tweet ID to profile tweets array if that profile follows the owner of the tweet', () => {
                const profile = {
                    ...dummyProfile,
                    following: [...dummyProfile.following, dummyProfiles[1].user._id]
                };
                const tweetId = action.payload._id;

                const currentState = {
                    ...initialState,
                    profile
                };

                const expectedState = {
                    ...currentState,
                    profile: {
                        ...profile,
                        tweets: [tweetId, ...profile.tweets],
                    }
                };

                expect(profileReducer(currentState, action)).toEqual(expectedState);
            });
        });

        describe('REMOVE_TWEET', () => {
            const action = { type: REMOVE_TWEET, payload: dummyTweet._id };

            test('does not update the state when profile is null', () => {
                expect(profileReducer(undefined, action)).toEqual(initialState);
            });

            test('removes tweet ID from profile tweets and homepageTweets array, when user is the owner of that tweet', () => {
               const profile = dummyProfiles[1];
               const tweetId = action.payload;

                const currentState = {
                   ...initialState,
                   profile: {
                       ...profile,
                       tweets: [tweetId, ...profile.tweets],
                       homepageTweets: [tweetId, ...profile.homepageTweets]
                   }
               };

                const expectedState = {
                    ...initialState,
                    profile
                };

                expect(profileReducer(currentState, action)).toEqual(expectedState);
            });

            test('removes tweet ID from profile tweets array)', () => {
                // Case when profile follows the owner of that tweet, and has the reference in tweets array
                const profile = dummyProfile;
                const tweetId = action.payload;

                const currentState = {
                    ...initialState,
                    profile: {
                        ...profile,
                        tweets: [tweetId, ...profile.tweets]
                    }
                };

                const expectedState = {
                    ...initialState,
                    profile
                };

                expect(profileReducer(currentState, action)).toEqual(expectedState);
            });
        });

        describe('LIKE_TWEET', () => {
            const action = (tweetId, authUserId) => ({
                type: LIKE_TWEET,
                payload: {
                    tweetId,
                    authUserId
                }
            });

            test('does not update the profile when profile is null', () => {
                const tweetId = dummyTweet._id;
                const authUserId = dummyProfile.user._id;
                expect(profileReducer(undefined, action(tweetId, authUserId))).toEqual(initialState);
            });

            test('does not update the profile when current profile is not the auth user profile', () => {
                const currentState = {
                    ...initialState,
                    profile: dummyProfiles[1]
                };
                const tweetId = dummyTweet._id;
                const authUserId = dummyProfile.user._id;

                expect(profileReducer(currentState, action(tweetId, authUserId))).toEqual(currentState);
            });

            test('adds ID of liked tweet to profile likes array', () => {
                const currentState = {
                    ...initialState,
                    profile: dummyProfile
                };

                const expectedState = {
                    ...currentState,
                    profile: {
                        ...currentState.profile,
                        likes: [...currentState.profile.likes, dummyTweet._id]
                    }
                };

                expect(profileReducer(currentState, action(dummyTweet._id, dummyProfile.user._id))).toEqual(expectedState);
            });

            test('removes ID of liked tweet from profile likes array', () => {
                const currentState = {
                    ...initialState,
                    profile: {
                        ...dummyProfile,
                        likes: [...dummyProfile.likes, dummyTweet._id]
                    }
                };

                const expectedState = {
                    ...currentState,
                    profile: {
                        ...currentState.profile,
                        likes: [...dummyProfile.likes]
                    }
                };

                expect(profileReducer(currentState, action(dummyTweet._id, dummyProfile.user._id))).toEqual(expectedState);
            });
        });
    });
});