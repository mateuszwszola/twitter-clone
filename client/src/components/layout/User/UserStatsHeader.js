import React from 'react';
import PropTypes from 'prop-types';
import ProfileStatGroup from './ProfileStatGroup';
import { EditProfileButton, FollowProfileButton } from 'shared/components';
import { ProfileHeaderMenu, HeaderMenuList } from './style';

const UserStatsHeader = ({ profile, owner, isAuthenticated, followed }) => (
  <ProfileHeaderMenu>
    <HeaderMenuList>
      <ProfileStatGroup label="Tweets" value={profile.tweets.length} />
      <ProfileStatGroup label="Following" value={profile.following.length} />
      <ProfileStatGroup label="Followers" value={profile.followers.length} />
      <ProfileStatGroup label="Likes" value={profile.likes.length} />
    </HeaderMenuList>
    {owner ? (
      <div>
        <EditProfileButton primary>Edit Profile</EditProfileButton>
      </div>
    ) : (
      <div>
        {isAuthenticated ? (
          <FollowProfileButton primary>
            {followed ? 'Unfollow' : 'Follow'}
          </FollowProfileButton>
        ) : (
          ''
        )}
      </div>
    )}
  </ProfileHeaderMenu>
);

UserStatsHeader.propTypes = {
  profile: PropTypes.object.isRequired,
  owner: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  followed: PropTypes.bool.isRequired
};

export default UserStatsHeader;
