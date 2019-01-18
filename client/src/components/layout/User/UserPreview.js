import React from 'react';
import PropTypes from 'prop-types';
import { UserAvatar } from '../../UI/UserAvatar';
import LinkedUserName from './LinkedUserName';
import LinkedUserUsername from './LinkedUserUsername';
import ProfileStatGroup from './ProfileStatGroup';
import avatar from '../../../img/tiger-avatar-example.jpg';

import styled from 'styled-components';

function UserPreview({ profile }) {
  return (
    <div className="user-preview-container">
      <div className="user-preview-background" />
      <div className="user-preview-avatar">
        <UserAvatar src={avatar} alt="User avatar" small />
      </div>
      <div className="user-preview-user-data">
        <LinkedUserName
          name={profile.user.name}
          username={profile.user.username}
        />
        <LinkedUserUsername username={profile.user.username} />
      </div>
      <div className="user-preview-stats">
        <ul className="header-menu-list">
          <ProfileStatGroup label="Tweets" value={profile.tweets.length} />
          <ProfileStatGroup
            label="Following"
            value={profile.following.length}
          />
          <ProfileStatGroup
            label="Followers"
            value={profile.followers.length}
          />
        </ul>
      </div>
    </div>
  );
}

UserPreview.propTypes = {
  profile: PropTypes.object.isRequired
};

export default UserPreview;
