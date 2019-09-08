import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { getProfileFollowing } from 'actions/profileActions';
import { connect } from 'react-redux';
import Loading from '../Loading';
import { ProfileList } from './style';
import ProfilePreview from './ProfilePreview';

function Following({
  profile: { profile, profiles, loading },
  getProfileFollowing
}) {
  useEffect(() => {
    getProfileFollowing(profile.user._id);
  }, [profile.user._id]);

  return (
    <>
      {loading || profiles === null ? (
        <Loading />
      ) : (
        <ProfileList>
          {profiles.map(profile => (
            <ProfilePreview key={profile._id} profile={profile} />
          ))}
        </ProfileList>
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
