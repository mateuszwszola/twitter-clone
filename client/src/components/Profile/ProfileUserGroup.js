import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { UserAvatar } from 'components/layout/user/UserAvatar';
import LinkedUserName from 'components/layout/user/LinkedUserName';
import LinkedUserUsername from 'components/layout/user/LinkedUserUsername';
import { UserInfoJoined } from 'components/layout/user/style';
import portretPlaceholder from 'img/portret-placeholder.png';

function ProfileUserGroup({ profile }) {
  return (
    <div className="profile-user-info">
      <UserAvatar
        src={profile.user.avatar || portretPlaceholder}
        alt="User Avatar"
      />
      <LinkedUserName
        username={profile.user.username}
        name={profile.user.name}
      />
      <LinkedUserUsername username={profile.user.username} />
      {profile.location && <p>Location: {profile.location}</p>}
      {profile.bio && <p>Bio: {profile.bio}</p>}
      {profile.website && <p>Website: {profile.website}</p>}
      <UserInfoJoined>
        <i className="fas fa-calendar-alt" /> Joined{' '}
        {format(new Date(profile.createdAt), 'MMMM yyyy')}
      </UserInfoJoined>
    </div>
  );
}

ProfileUserGroup.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileUserGroup;
