import Profiles from 'components/Profiles';
import React from 'react';
import { useParams } from 'react-router';
import { useProfiles } from 'utils/profiles';
import DisplayError from 'components/DisplayError';

function Followers() {
  const { userId } = useParams();
  const { isLoading, data, error } = useProfiles({ following: userId });

  if (error) {
    return <DisplayError error={error} />;
  }

  return <Profiles loading={isLoading} profiles={data?.results || []} />;
}

export default Followers;
