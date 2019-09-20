import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'shared/layout';
import { PrimaryHeading } from 'shared/components';
import ProfilesList from 'components/Profile/ProfilesList';
import ProfilePreview from "components/Profile/ProfilePreview";
import Loading from 'components/Loading';

function Profiles({ profile: { loading, profiles } }) {
    return (
        <Container>
            <PrimaryHeading>All profiles</PrimaryHeading>
            {loading || !profiles ? (
                <Loading />
            ) : (
                <ProfilesList>
                    {profiles.map(profile => (
                        <ProfilePreview key={profile._id} profile={profile}/>
                    ))}
                </ProfilesList>
            )}
        </Container>
    )
}

Profiles.propTypes = {
    profile: PropTypes.object.isRequired,
};

export default Profiles;