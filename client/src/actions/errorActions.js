import { CLEAR_ERRORS } from './types';
import store from '../store';

export const clearErrors = () => dispatch => {
  if (store.getState().errors.length > 0) {
    dispatch({ type: CLEAR_ERRORS });
  }
};
