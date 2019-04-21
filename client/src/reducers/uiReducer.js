import {
  OPEN_CREATE_TWEET_MODAL,
  CLOSE_CREATE_TWEET_MODAL
} from '../actions/types';

const initialState = {
  showCreateTweetModal: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case OPEN_CREATE_TWEET_MODAL:
      return {
        ...state,
        showCreateTweetModal: true
      };
    case CLOSE_CREATE_TWEET_MODAL:
      return {
        ...state,
        showCreateTweetModal: false
      };
    default:
      return state;
  }
}
