import {
  SET_CURRENT_PROFILE,
  CLEAR_CURRENT_PROFILE,
  SET_PROFILES,
  PROFILE_LOADING
} from '../actions/types';

const initialState = {
  currentProfile: null,
  profiles: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true
      };
    case SET_CURRENT_PROFILE:
      return {
        ...state,
        currentProfile: action.payload,
        loading: false
      };
    case SET_PROFILES:
      return {
        ...state,
        profiles: action.payload,
        loading: false
      };
    case CLEAR_CURRENT_PROFILE:
      return {
        ...state,
        currentProfile: null
      };
    default:
      return state;
  }
}
