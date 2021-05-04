import React from 'react';
import Profiles from 'components/Profiles';
import { useProfiles } from 'utils/profiles';
import { Container } from 'shared/layout';
import { DisplayError, PrimaryHeading } from 'shared/components';

function ProfilesPage() {
  const { isLoading, error, data } = useProfiles();

  if (error) {
    return (
      <DisplayError>
        An error has occurred:{' '}
        {error?.response?.data?.message || 'Something went wrong...'}
      </DisplayError>
    );
  }

  return (
    <Container>
      <PrimaryHeading>All profiles</PrimaryHeading>
      <Profiles profiles={data?.results || []} loading={isLoading} />
    </Container>
  );
}

export default ProfilesPage;
