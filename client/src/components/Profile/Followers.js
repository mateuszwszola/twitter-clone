import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { getProfileFollowers } from '../../actions/profileActions';
import { connect } from 'react-redux';
import Loading from '../Loading';
import ProfilesList from './ProfilesList';
import ProfilePreview from './ProfilePreview';

const Followers = ({
  profile: { profile, profiles, loading },
  getProfileFollowers
}) => {
  useEffect(() => {
    getProfileFollowers(profile.user._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.user._id]);
  return (
    <>
      {loading || profiles === null ? (
        <Loading />
      ) : (
        <ProfilesList>
          {profiles.map(profile => (
            <ProfilePreview key={profile._id} profile={profile} />
          ))}
        </ProfilesList>
      )}
    </>
  );
};

Followers.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfileFollowers: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getProfileFollowers }
)(Followers);
