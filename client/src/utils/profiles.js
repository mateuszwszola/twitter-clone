import client from 'api/client';
import { useInfiniteQuery, useQuery } from 'react-query';
import pick from 'lodash/pick';
import { getFilteredQuery, objToQueryString } from './queryHelpers';

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

export { useProfiles, useProfile };
