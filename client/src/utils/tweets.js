import client from 'api/client';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import pick from 'lodash/pick';
import { getFilteredQuery, objToQueryString } from './queryHelpers';

function useFeedTweets() {
  const fetchFeedTweets = ({ pageParam = 1 }) =>
    client.get(`/tweets/feed?page=${pageParam}`).then((res) => res.data);

  return useInfiniteQuery(['tweets', 'feed'], fetchFeedTweets, {
    getNextPageParam: ({ page, totalPages }) =>
      page < totalPages ? page + 1 : undefined,
  });
}

function useTweets(query = {}) {
  const pickedQuery = pick(query, [
    'sortBy',
    'limit',
    'author',
    'likes',
    'retweets',
    'replyTo',
  ]);

  const filteredQuery = getFilteredQuery(pickedQuery);

  const fetchTweets = ({ pageParam = 1 }) => {
    const queryString = objToQueryString({ ...filteredQuery, page: pageParam });

    return client.get(`/tweets?${queryString}`).then((res) => res.data);
  };

  return useInfiniteQuery(['tweets', filteredQuery], fetchTweets, {
    getNextPageParam: ({ page, totalPages }) =>
      page < totalPages ? page + 1 : undefined,
  });
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
    onSuccess: () => {
      queryClient.invalidateQueries('tweets');
    },
  });
}

function useTweetUnlike() {
  const queryClient = useQueryClient();

  return useMutation((tweetId) => client.delete(`/tweets/like/${tweetId}`), {
    onSuccess: () => {
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
