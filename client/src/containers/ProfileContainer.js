import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfileByUsername } from 'actions/profileActions';
import Profile from 'components/Profile';
import Loading from 'components/Loading';
import { TweetModal } from 'components/Tweet';
import { Route } from 'react-router-dom';

function ProfileContainer({ profile, getProfileByUsername, errors, match }) {
  // TODO: Check if user is the owner
  // 1. User is the owner
  // 2. User is not the owner but they are logged in so they can follow/unfollow etc.
  // 3. There is anonymous user who can only view it
  // 4. UI for 2 and 3 is almost the same. But for 3. when user clicks follow it will popup that you need to be authenticated to follow that user
  const { username } = match.params;

  useEffect(() => {
    getProfileByUsername(username);
  }, [username]);

  return (
    <>
      {profile.profile === null ? <Loading /> : <Profile profile={profile} />}
      <Route path={`${match.path}/status/:status_id`} component={TweetModal} />
    </>
  );
}

ProfileContainer.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getProfileByUsername: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getProfileByUsername }
)(ProfileContainer);
