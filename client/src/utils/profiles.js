import client from 'api/client';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import pick from 'lodash/pick';
import { getFilteredQuery, objToQueryString } from './queryHelpers';
import { followUser, unfollowUser } from 'api/profile';
import { useUser } from 'context/UserContext';
import { useAlert } from 'context/AlertContext';

function useProfiles(query = {}) {
  const pickedQuery = pick(query, [
    'sortBy',
    'limit',
    'following',
    'followers',
    'likes',
    'retweets',
  ]);

  const filteredQuery = getFilteredQuery(pickedQuery);

  const fetchProfiles = ({ pageParam = 1 }) => {
    const queryString = objToQueryString({ ...filteredQuery, page: pageParam });

    return client.get(`/profiles/?${queryString}`).then((res) => res.data);
  };

  return useInfiniteQuery(['profiles', filteredQuery], fetchProfiles, {
    getNextPageParam: ({ page, totalPages }) =>
      page < totalPages ? page + 1 : undefined,
  });
}

function useProfile(id) {
  return useQuery(['profiles', id], () =>
    client.get(`/profiles/${id}`).then((res) => res.data.profile)
  );
}

function useProfileFollowMutation() {
  const queryClient = useQueryClient();
  const authUser = useUser();
  const { setAlert } = useAlert();

  return useMutation((userId) => followUser(userId), {
    onMutate: async (userId) => {
      await queryClient.cancelQueries(['profiles', userId]);

      const previousProfile = queryClient.getQueryData(['profiles', userId]);

      queryClient.setQueryData(['profiles', userId], (old) => ({
        ...old,
        followers: [...old.followers, authUser._id],
      }));

      return { previousProfile };
    },
    onError: (_err, userId, context) => {
      setAlert({ type: 'error', msg: 'Something went wrong...' });
      queryClient.setQueryData(['profiles', userId], context.previousProfile);
    },
    onSettled: (userId) => {
      queryClient.invalidateQueries(['profiles', userId]);
    },
  });
}

function useProfileUnfollowMutation() {
  const queryClient = useQueryClient();
  const authUser = useUser();
  const { setAlert } = useAlert();

  return useMutation((userId) => unfollowUser(userId), {
    onMutate: async (userId) => {
      await queryClient.cancelQueries(['profiles', userId]);

      const previousProfile = queryClient.getQueryData(['profiles', userId]);

      queryClient.setQueryData(['profiles', userId], (old) => ({
        ...old,
        followers: old.followers.filter((id) => id !== authUser._id),
      }));

      return { previousProfile };
    },
    onError: (_err, userId, context) => {
      setAlert({ type: 'error', msg: 'Something went wrong...' });
      queryClient.setQueryData(['profiles', userId], context.previousProfile);
    },
    onSettled: (userId) => {
      queryClient.invalidateQueries(['profiles', userId]);
    },
  });
}

export {
  useProfiles,
  useProfile,
  useProfileFollowMutation,
  useProfileUnfollowMutation,
};
