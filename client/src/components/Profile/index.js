import React from 'react';
import PropTypes from 'prop-types';
import { EditProfileButton } from '../UI/Button';
import UserInfo from './UserInfo';
import Header from './Header';
import Board from './Board';

const owner = false;

function Profile({ profile }) {
  return (
    <div className="profile-container">
      <div className="profile-background-place" />
      {owner ? (
        <EditProfileButton primary>Edit Profile</EditProfileButton>
      ) : null}
      <UserInfo profile={profile} />
      <Header profile={profile} />
      <Board tweets={profile.tweets} />
    </div>
  );
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired
  // owner: PropTypes.bool.isRequired
};

export default Profile;
