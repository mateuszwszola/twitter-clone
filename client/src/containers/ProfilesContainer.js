import React from 'react';
import { useQuery } from 'react-query';
import Profiles from 'components/Profiles';
import { getProfiles } from 'api/profile';

function ProfilesContainer() {
  const { isLoading, error, data } = useQuery('profiles', getProfiles);

  if (error) {
    return <p>An error has occurred: {error.message}</p>;
  }

  return <Profiles profiles={data?.results || []} loading={isLoading} />;
}

export default ProfilesContainer;
