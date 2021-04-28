import client from 'api/client';
import { useMutation, useQuery, useQueryClient } from 'react-query';
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
    client.get(`/tweets/feed?${queryString}`).then((res) => res.data)
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

function useCreateTweet() {
  const queryClient = useQueryClient();
  return useMutation((newTweet) => client.post('/tweets', newTweet), {
    onSuccess: () => {
      queryClient.invalidateQueries('tweets');
    },
  });
}

function useRemoveTweet() {
  const queryClient = useQueryClient();
  return useMutation((tweetId) => client.delete(`/tweets/${tweetId}`), {
    onSuccess: () => {
      queryClient.invalidateQueries('tweets');
    },
  });
}

function useTweetLike() {
  const queryClient = useQueryClient();

  return useMutation((tweetId) => client.post(`/tweets/like/${tweetId}`), {
    onSettled: () => {
      queryClient.invalidateQueries('tweets');
    },
  });
}

function useTweetUnlike() {
  const queryClient = useQueryClient();

  return useMutation((tweetId) => client.delete(`/tweets/like/${tweetId}`), {
    onSettled: () => {
      queryClient.invalidateQueries('tweets');
    },
  });
}

export {
  useFeedTweets,
  useTweets,
  useTweet,
  useCreateTweet,
  useRemoveTweet,
  useTweetLike,
  useTweetUnlike,
};
