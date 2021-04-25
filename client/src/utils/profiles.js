import client from 'api/client';
import { useQuery } from 'react-query';
import pick from 'lodash.pick';
import { getFilteredQuery, objToQueryString } from './queryHelpers';

function useProfiles(query = {}) {
  const pickedQuery = pick(query, [
    'sortBy',
    'limit',
    'page',
    'following',
    'followers',
    'likes',
    'retweets',
  ]);

  const filteredQuery = getFilteredQuery({
    ...pickedQuery,
    page: query.page || 1,
  });
  const queryString = objToQueryString(filteredQuery);

  return useQuery(['profiles', filteredQuery], () =>
    client.get(`/profiles?${queryString}`).then((res) => res.data)
  );
}

function useProfile(id) {
  return useQuery(['profiles', id], () =>
    client.get(`/profiles/${id}`).then((res) => res.data)
  );
}

export { useProfiles, useProfile };
