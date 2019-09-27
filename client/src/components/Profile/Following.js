import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { getProfileFollowing } from 'actions/profileActions';
import { connect } from 'react-redux';
import Loading from '../Loading';
import ProfilesList from './ProfilesList';
import ProfilePreview from './ProfilePreview';
import { InfoText } from 'shared/components';

function Following({
  profile: { profile, profiles, loading },
  getProfileFollowing
}) {
  useEffect(() => {
    getProfileFollowing(profile.user._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.user._id]);

  return (
    <>
      {loading || profiles === null ? (
        <Loading />
      ) : (
        <ProfilesList>
          {profiles.length > 0 ? (
              <>
                {profiles.map(profile => (
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
};

Following.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfileFollowing: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getProfileFollowing }
)(Following);
