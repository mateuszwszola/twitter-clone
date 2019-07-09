import { CLEAR_ERRORS } from './types';
import store from '../store';

export const clearErrors = () => dispatch => {
  if (Object.keys(store.getState().errors).length) {
    dispatch({ type: CLEAR_ERRORS });
  }
};
