import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
  return (
    <>
      {loading || profiles === null ? (
        <Loading />
      ) : (
        <>
          {profiles.map(profile => (
            <div key={profile._id}>
              <Link to={`/${profile.user.username}`}>
                <h3>{profile.user.name}</h3>
                <p>@{profile.user.username}</p>
              </Link>
            </div>
          ))}
        </>
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
