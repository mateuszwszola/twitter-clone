import React from 'react';
import PropTypes from 'prop-types';
import ProfileStatGroup from './ProfileStatGroup';

const UserStatsHeader = ({ profile }) => (
  <div className="profile-header-menu">
    <ul className="header-menu-list">
      <ProfileStatGroup label="Tweets" value={profile.tweets.length} />
      <ProfileStatGroup label="Following" value={profile.following.length} />
      <ProfileStatGroup label="Followers" value={profile.followers.length} />
      <ProfileStatGroup label="Likes" value={profile.likes.length} />
    </ul>
  </div>
);

UserStatsHeader.propTypes = {
  profile: PropTypes.object.isRequired
};

export default UserStatsHeader;
