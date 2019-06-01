import React from 'react';
import PropTypes from 'prop-types';
import { UserAvatar } from '../UI/UserAvatar';
import LinkedUserName from './User/LinkedUserName';
import LinkedUserUsername from './User/LinkedUserUsername';
import ProfileStatGroup from './User/ProfileStatGroup';
import avatar from '../../img/tiger-avatar-example.jpg';

import UserPreviewCard from './UserPreviewCard';

function UserPreview({ profile }) {
  return (
    <UserPreviewCard>
      <UserPreviewCard.Background />
      <UserPreviewCard.MidFlex>
        <UserAvatar
          className="user-preview-avatar"
          src={avatar}
          alt="User avatar"
          small
        />
        <div className="user-preview-user-data">
          <LinkedUserName
            name={profile.user.name}
            username={profile.user.username}
          />
          <LinkedUserUsername username={profile.user.username} />
        </div>
      </UserPreviewCard.MidFlex>
      <UserPreviewCard.StatsContainer>
        <UserPreviewCard.HeaderMenu>
          <ProfileStatGroup label="Tweets" value={profile.tweets.length} />
          <ProfileStatGroup
            label="Following"
            value={profile.following.length}
          />
          <ProfileStatGroup
            label="Followers"
            value={profile.followers.length}
          />
        </UserPreviewCard.HeaderMenu>
      </UserPreviewCard.StatsContainer>
    </UserPreviewCard>
  );
}

UserPreview.propTypes = {
  profile: PropTypes.object.isRequired
};

export default UserPreview;