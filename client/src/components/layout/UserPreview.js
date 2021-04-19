import React from 'react';
import PropTypes from 'prop-types';
import { UserAvatar } from 'components/layout/user/UserAvatar';
import LinkedUserName from './user/LinkedUserName';
import LinkedUserUsername from './user/LinkedUserUsername';
import ProfileStatGroup from './user/ProfileStatGroup';
import portretPlaceholder from 'img/portret-placeholder.png';
import { Link } from 'react-router-dom';
import { ProfileBackground } from 'shared/components';

import UserPreviewCard from './UserPreviewCard';

function UserPreview({ profile }) {
  return (
    <UserPreviewCard>
      <UserPreviewCard.Background showColor={!profile.backgroundImage}>
        {profile.backgroundImage ? (
          <ProfileBackground
            src={profile.backgroundImage}
            alt={`${profile.user.name || 'User'} background`}
          />
        ) : (
          ''
        )}
      </UserPreviewCard.Background>
      <UserPreviewCard.MidFlex>
        <UserAvatar
          className="user-preview-avatar"
          src={profile.avatar || portretPlaceholder}
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
          <Link to={`${profile.user.username}`}>
            {/* <ProfileStatGroup label="Tweets" value={profile.tweets.length} /> */}
          </Link>
          <Link to={`${profile.user.username}/following`}>
            <ProfileStatGroup
              label="Following"
              value={profile.following.length}
              username={profile.user.username}
            />
          </Link>
          <Link to={`${profile.user.username}/followers`}>
            <ProfileStatGroup
              label="Followers"
              value={profile.followers.length}
              username={profile.user.username}
            />
          </Link>
        </UserPreviewCard.HeaderMenu>
      </UserPreviewCard.StatsContainer>
    </UserPreviewCard>
  );
}

UserPreview.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default UserPreview;
