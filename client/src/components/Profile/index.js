import React from 'react';
import PropTypes from 'prop-types';
import ProfileUserGroup from './ProfileUserGroup';
import UserStatsHeader from '../layout/User/UserStatsHeader';
import TweetsBoard from '../layout/TweetsBoard';
import Loading from '../Loading';

function Profile({ profile, tweet, auth }) {
  let owner = false;
  let followButtonText = 'Follow';

  // let owner =
  //   auth.isAuthenticated &&
  //   auth.user &&
  //   auth.user.username === profile.profile.user.username;
  // let followButtonText = 'Follow';
  // if (auth.isAuthenticated) {
  //   let follow =
  //     profile.profile.followers.filter(follower =>
  //       follower.user.equals(auth.user.id)
  //     ).length > 0;
  //   if (follow) {
  //     followButtonText = 'Unfollow';
  //   }
  //}

  return (
    <div className="profile-container">
      <div className="profile-background-place" />
      <div className="profile-user-stats-header">
        <UserStatsHeader
          profile={profile}
          owner={owner}
          followButtonText={followButtonText}
        />
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
  auth: PropTypes.object.isRequired
};

export default Profile;
