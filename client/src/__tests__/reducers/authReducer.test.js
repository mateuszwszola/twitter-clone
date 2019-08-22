import authReducer from "reducers/authReducer";
import {
    USER_LOADED,
    REGISTER_SUCCESS,
    LOGIN_SUCCESS,
    LOGOUT
} from "actions/types";
import dummyUser from '__tests__/dummyData/user';

const initialState = {
    token: null,
    isAuthenticated: false,
    user: null,
    loading: true
};

describe('authReducer', () => {
    describe('INITIAL_STATE', () => {
        test('is correct', () => {
            const action = { type: 'DUMMY_ACTION' };

            expect(authReducer(undefined, action)).toEqual(initialState);
        });
    });

    describe('USER_LOADED', () => {
       test('returns the correct state', () => {
           const action = { type: USER_LOADED, payload: dummyUser };
           const expectedState = {
               ...initialState,
               isAuthenticated: true,
               user: dummyUser,
               loading: false
           };

           expect(authReducer(undefined, action)).toEqual(expectedState);
       });
    });

    describe('SUCCESS LOGIN AND SUCCESS REGISTER', () => {
        const payload = {
            user: dummyUser,
            token: 'token'
        };

        const expectedState = {
            ...initialState,
            ...payload,
            isAuthenticated: true,
            loading: false
        };

        describe('LOGIN_SUCCESS', () => {
            test('returns the correct state', () => {
               const action = { type: LOGIN_SUCCESS, payload };

               expect(authReducer(undefined, action)).toEqual(expectedState);
            });
        });

        describe('REGISTER_SUCCESS', () => {
            test('returns the correct state', () => {
                const action = { type: REGISTER_SUCCESS, payload };

                expect(authReducer(undefined, action)).toEqual(expectedState);
            });
        });
    });

    describe('LOGOUT', () => {
        test('returns the correct state', () => {
            const action = { type: LOGOUT };
            const expectedState = {
                ...initialState,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null
            };

            expect(authReducer(undefined, action)).toEqual(expectedState);
        });
    });
});

