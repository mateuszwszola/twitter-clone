import React from 'react';
import PropTypes from 'prop-types';
import { UserAvatar } from 'components/layout/user/UserAvatar';
import avatar from 'img/tiger-avatar-example.jpg';
import LinkedUserName from 'components/layout/user/LinkedUserName';
import LinkedUserUsername from 'components/layout/user/LinkedUserUsername';
import ProfileCreatedGroup from 'components/layout/user/ProfileCreatedGroup';

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
