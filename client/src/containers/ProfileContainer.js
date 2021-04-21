import React from 'react';
import { useQuery } from 'react-query';
import { getProfile } from 'api/profile';
import Profile from 'components/Profile';
import Loading from 'components/Loading';
import { DisplayError } from 'shared/components';

function ProfileContainer({ match }) {
  const { userId } = match.params;
  const { isLoading, isError, error, data } = useQuery(
    ['profiles', userId],
    () => getProfile(userId)
  );

  if (isError) {
    return (
      <DisplayError>
        An error has occurred: {error.response?.data?.message}
      </DisplayError>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  return <Profile profile={data.profile} />;
}

export default ProfileContainer;
