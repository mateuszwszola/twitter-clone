import client from 'api/client';
import { useQuery } from 'react-query';
import pick from 'lodash.pick';
import { getFilteredQuery, objToQueryString } from './queryHelpers';

function useFeedTweets(query = {}) {
  const pickedQuery = pick(query, ['sortBy', 'limit', 'page']);

  const filteredQuery = getFilteredQuery({
    ...pickedQuery,
    page: query.page || 1,
  });
  const queryString = objToQueryString(filteredQuery);

  return useQuery(['tweets', 'feed', filteredQuery], () =>
    client.get(`/tweets/feed?${queryString}`)
  );
}

function useTweets(query = {}) {
  const pickedQuery = pick(query, [
    'sortBy',
    'limit',
    'page',
    'author',
    'likes',
    'retweets',
    'replyTo',
  ]);

  const filteredQuery = getFilteredQuery({
    ...pickedQuery,
    page: query.page || 1,
  });
  const queryString = objToQueryString(filteredQuery);

  return useQuery(['tweets', filteredQuery], () =>
    client.get(`/tweets?${queryString}`).then((res) => res.data)
  );
}

function useTweet(id) {
  return useQuery(['tweets', id], () =>
    client.get(`/tweets/${id}`).then((res) => res.data)
  );
}

export { useFeedTweets, useTweets, useTweet };
