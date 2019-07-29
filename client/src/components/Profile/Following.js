import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { getProfileFollowing } from 'actions/profileActions';
import { connect } from 'react-redux';
import Loading from '../Loading';

const Following = ({
  profile: { profile, profiles, loading },
  getProfileFollowing
}) => {
  useEffect(() => {
    getProfileFollowing(profile.user._id);
  }, [getProfileFollowing, profile.user._id]);
  return <>{loading ? <Loading /> : <>{JSON.stringify(profiles)}</>}</>;
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
