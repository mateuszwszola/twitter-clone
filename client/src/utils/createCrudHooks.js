// https://gist.github.com/tannerlinsley/c6c0064239e0bcf40ca3703f95c0fb11

import { useQuery, useMutation, queryCache } from 'react-query';

export default function createCrudHooks({
  baseKey,
  indexFn,
  singleFn,
  createFn,
  updateFn,
  deleteFn,
}) {
  const useIndex = (config, query = '') =>
    useQuery([baseKey, query], () => indexFn(query), config);
  const useSingle = (id, config) =>
    useQuery([baseKey, id], () => singleFn(id), config);
  const useCreate = (config = {}) =>
    useMutation(createFn, {
      ...config,
      onSuccess: (...args) => {
        queryCache.invalidateQueries([baseKey]);
        if (config.onSuccess) config.onSuccess(...args);
      },
    });
  const useUpdate = (config = {}) =>
    useMutation(updateFn, {
      ...config,
      onSuccess: (...args) => {
        queryCache.invalidateQueries([baseKey]);
        if (config.onSuccess) config.onSuccess(...args);
      },
    });
  const useDelete = (config = {}) =>
    useMutation(deleteFn, {
      ...config,
      onSuccess: (...args) => {
        queryCache.invalidateQueries([baseKey]);
        if (config.onSuccess) config.onSuccess(...args);
      },
    });
  return [useIndex, useSingle, useCreate, useUpdate, useDelete];
}
