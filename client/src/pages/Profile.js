import React from 'react';
import { useParams } from 'react-router-dom';
import Profile from 'components/Profile';
import Loading from 'components/Loading';
import { DisplayError } from 'shared/components';
import { useProfile } from 'utils/profiles';

function ProfilePage() {
  const { userId } = useParams();

  const { isLoading, isError, error, data: profile } = useProfile(userId);

  if (isError) {
    // TODO: Use react-error-boundary
    return (
      <DisplayError>
        An error has occurred: {error.response?.data?.message}
      </DisplayError>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  return <Profile profile={profile} />;
}

export default ProfilePage;
