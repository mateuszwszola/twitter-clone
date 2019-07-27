import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getProfileWithTweetsByUsername,
  followProfile
} from 'actions/profileActions';
import Profile from 'components/Profile';
import Loading from 'components/Loading';
import DisplayErrors from 'components/DisplayErrors';
import isEmpty from 'utils/isEmpty';
import { TweetModal } from 'components/Tweet';
import { Route } from 'react-router-dom';

function ProfileContainer({
  match,
  auth,
  profile,
  tweet,
  getProfileWithTweetsByUsername,
  followProfile,
  errors
}) {
  const [owner, setOwner] = useState(false);
  // TODO: Check if user is the owner
  // 1. User is the owner
  // 2. User is not the owner but they are logged in so they can follow/unfollow etc.
  // 3. There is anonymous user who can only view it
  // 4. UI for 2 and 3 is almost the same. But for 3. when user clicks follow it will popup that you need to be authenticated to follow that user
  const { username } = match.params;
  useEffect(() => {
    setOwner(!!(auth.user && auth.user.username === username));
  }, [auth, username]);

  useEffect(() => {
    getProfileWithTweetsByUsername(username);
  }, [getProfileWithTweetsByUsername, username]);

  if (!isEmpty(errors)) {
    return <DisplayErrors error={errors.message} />;
  }

  return (
    <>
      {profile.profile === null ? (
        <Loading />
      ) : (
        <Profile
          profile={profile}
          tweet={tweet}
          owner={owner}
          auth={auth}
          match={match}
          followProfile={followProfile}
        />
      )}
      <Route path={`${match.path}/status/:status_id`} component={TweetModal} />
    </>
  );
}

ProfileContainer.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  tweet: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getProfileWithTweetsByUsername: PropTypes.func.isRequired,
  followProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  tweet: state.tweet,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getProfileWithTweetsByUsername, followProfile }
)(ProfileContainer);
