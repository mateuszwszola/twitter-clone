import React from 'react';
import PropTypes from 'prop-types';
import { UserAvatar } from 'components/layout/user/UserAvatar';
import portretPlaceholder from 'img/portret-placeholder.png';
import LinkedUserName from 'components/layout/user/LinkedUserName';
import LinkedUserUsername from 'components/layout/user/LinkedUserUsername';
import ProfileCreatedGroup from 'components/layout/user/ProfileCreatedGroup';

function ProfileUserGroup({ profile }) {
  return (
    <div className="profile-user-info">
      <UserAvatar src={profile.user.avatar || portretPlaceholder} alt="User Avatar" />
      <LinkedUserName
        username={profile.user.username}
        name={profile.user.name}
      />
      <LinkedUserUsername username={profile.user.username} />
      {profile.location && <p>Location: {profile.location}</p>}
      {profile.bio && <p>Bio: {profile.bio}</p>}
      {profile.website && <p>Website: {profile.website}</p>}
      <ProfileCreatedGroup created={profile.created} />
    </div>
  );
}

ProfileUserGroup.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileUserGroup;
