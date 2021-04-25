import React from 'react';
import { useParams } from 'react-router-dom';
import Profiles from 'components/Profiles';
import DisplayError from 'components/DisplayError';
import { useProfiles } from 'utils/profiles';

function Following() {
  const { userId } = useParams();
  const { isLoading, data, error } = useProfiles({ followers: userId });

  if (error) {
    return <DisplayError error={error} />;
  }

  return <Profiles loading={isLoading} profiles={data?.results || []} />;
}

export default Following;
