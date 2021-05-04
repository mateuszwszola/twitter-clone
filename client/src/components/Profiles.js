import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { InfoText } from 'shared/components';
import ProfileCard from 'components/ProfileCard';
import Loading from 'components/Loading';

export const ProfilesList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 1rem;
`;

function Profiles({ loading, profiles }) {
  return (
    <>
      {loading || !profiles ? (
        <Loading />
      ) : (
        <ProfilesList>
          {profiles.length > 0 ? (
            <>
              {profiles.map((profile) => (
                <ProfileCard key={profile._id} profile={profile} />
              ))}
            </>
          ) : (
            <>
              <InfoText>There are no profiles to display</InfoText>
            </>
          )}
        </ProfilesList>
      )}
    </>
  );
}

Profiles.propTypes = {
  profiles: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default Profiles;
