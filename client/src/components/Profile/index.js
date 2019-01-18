import React from 'react';
import PropTypes from 'prop-types';
import { EditProfileButton } from '../UI/Button';
import ProfileUserGroup from './ProfileUserGroup';
import UserStatsHeader from '../layout/User/UserStatsHeader';
import TweetsBoard from '../layout/TweetsBoard';

function Profile({ profile, user, isAuthenticated }) {
  const owner =
    isAuthenticated && user.username && profile.user.username === user.username;
  return (
    <div className="profile-container">
      <div className="profile-background-place" />
      {owner ? (
        <EditProfileButton primary>Edit Profile</EditProfileButton>
      ) : null}
      <ProfileUserGroup profile={profile} />
      <UserStatsHeader profile={profile} />
      <TweetsBoard tweets={profile.tweets} />
    </div>
  );
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

export default Profile;
