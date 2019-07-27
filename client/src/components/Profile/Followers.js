import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { getProfileFollowersProfiles } from '../../actions/profileActions';
import { connect } from 'react-redux';
import Loading from '../Loading';

const Followers = ({
  profile: { profile, profiles, loading },
  getProfileFollowersProfiles
}) => {
  useEffect(() => {
    getProfileFollowersProfiles(profile.user._id);
  }, [getProfileFollowersProfiles, profile.user._id]);
  return <>{loading ? <Loading /> : (
      <>
        {JSON.stringify(profiles)}
      </>
  )}</>;
};

Followers.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfileFollowersProfiles: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getProfileFollowersProfiles }
)(Followers);
