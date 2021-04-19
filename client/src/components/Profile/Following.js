import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfiles } from 'actions/profileActions';
import Loading from '../Loading';
import ProfilesList from './ProfilesList';
import ProfilePreview from './ProfilePreview';
import { InfoText } from 'shared/components';

function Following({ profile: { profile, profiles, loading }, getProfiles }) {
  useEffect(() => {
    getProfiles(`?followers=${profile.user._id}`);
  }, [profile.user._id]);

  return (
    <>
      {loading || profiles === null ? (
        <Loading />
      ) : (
        <ProfilesList>
          {profiles.length > 0 ? (
            <>
              {profiles.map((profile) => (
                <ProfilePreview key={profile._id} profile={profile} />
              ))}
            </>
          ) : (
            <InfoText>There are no profiles to display</InfoText>
          )}
        </ProfilesList>
      )}
    </>
  );
}

Following.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfiles: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfiles })(Following);
