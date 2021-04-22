import client from './client';

function getFeedTweets() {
  return client.get('/tweets/feed');
}

export { getFeedTweets };
