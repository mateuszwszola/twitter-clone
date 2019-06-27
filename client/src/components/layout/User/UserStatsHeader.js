import React from 'react';
import PropTypes from 'prop-types';
import ProfileStatGroup from './ProfileStatGroup';
import { EditProfileButton, FollowProfileButton } from '../../UI/Button';

const UserStatsHeader = ({ profile, owner, isAuthenticated, followed }) => (
  <div className="profile-header-menu">
    <ul className="header-menu-list">
      <ProfileStatGroup label="Tweets" value={profile.tweets.length} />
      <ProfileStatGroup label="Following" value={profile.following.length} />
      <ProfileStatGroup label="Followers" value={profile.followers.length} />
      <ProfileStatGroup label="Likes" value={profile.likes.length} />
    </ul>
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
  </div>
);

UserStatsHeader.propTypes = {
  profile: PropTypes.object.isRequired,
  owner: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  followed: PropTypes.bool.isRequired
};

export default UserStatsHeader;
