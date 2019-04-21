import { OPEN_CREATE_TWEET_MODAL, CLOSE_CREATE_TWEET_MODAL } from './types';

export const openCreateTweetModal = () => ({
  type: OPEN_CREATE_TWEET_MODAL
});

export const closeCreateTweetModal = () => ({
  type: CLOSE_CREATE_TWEET_MODAL
});
