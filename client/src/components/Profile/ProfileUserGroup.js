import React from 'react';
import PropTypes from 'prop-types';
import { UserAvatar } from '../UI/userAvatar';
import avatar from '../../img/tiger-avatar-example.jpg';
import LinkedUserName from '../layout/user/linkedUserName';
import LinkedUserUsername from '../layout/user/linkedUserUsername';
import ProfileCreatedGroup from '../layout/user/profileCreatedGroup';

const ProfileUserGroup = ({ profile }) => (
  <div className="profile-user-info">
    <UserAvatar src={avatar} alt="User Avatar" />
    <LinkedUserName username={profile.user.username} name={profile.user.name} />
    <LinkedUserUsername username={profile.user.username} />
    <ProfileCreatedGroup created={profile.created} />
  </div>
);

ProfileUserGroup.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileUserGroup;
