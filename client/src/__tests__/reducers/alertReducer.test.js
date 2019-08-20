import alertReducer from "reducers/alertReducer";
import {
    SET_ALERT,
    REMOVE_ALERT
} from "actions/types";

describe('alertReducer', () => {
    describe('INITIAL_STATE', () => {
        test('is correct', () => {
            const action = { type: 'DUMMY_ACTION' };
            const initialState = [];

            expect(alertReducer(undefined, action)).toEqual(initialState);
        });
    });

    describe('SET_ALERT', () => {
        test('sets the alert and return correct state', () => {
            const action = {
                type: SET_ALERT,
                payload: {
                    id: 1,
                    msg: 'Test alert',
                    alertType: 'success'
                }
            };
            const expectedState = [
                {
                    id: 1,
                    msg: 'Test alert',
                    alertType: 'success'
                }
            ];

            expect(alertReducer(undefined, action)).toEqual(expectedState);
        })
    })

    describe('REMOVE_ALERT', () => {
        test('removes the alert and return correct state', () => {
            const initialState = [
                {
                    id: 1,
                    msg: 'Test alert',
                    alertType: 'success'
                }
            ];
            const action = {
                type: REMOVE_ALERT,
                payload: 1,
            };
            const expectedState = [];

            expect(alertReducer(initialState, action)).toEqual(expectedState);
        });
    });
});