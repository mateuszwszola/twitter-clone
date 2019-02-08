import React from 'react';
import PropTypes from 'prop-types';
import ProfileUserGroup from './ProfileUserGroup';
import UserStatsHeader from '../layout/User/UserStatsHeader';
import TweetsBoard from '../layout/TweetsBoard';
import Loading from '../Loading';

function Profile({ profile, tweet, user, isAuthenticated }) {
  const owner =
    isAuthenticated && user.username && profile.user.username === user.username;
  return (
    <div className="profile-container">
      <div className="profile-background-place" />
      <div className="profile-user-stats-header">
        <UserStatsHeader profile={profile} owner={owner} />
      </div>
      <div className="profile-mid-flex">
        <div className="profile-user-group">
          <ProfileUserGroup profile={profile} />
        </div>
        <div className="profile-tweets-board">
          {tweet.loading || tweet.tweets === null ? (
            <Loading />
          ) : (
            <TweetsBoard tweets={tweet.tweets} />
          )}
        </div>
        <div className="profile-right-sidebar">Right sidebar</div>
      </div>
    </div>
  );
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  tweet: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

export default Profile;
