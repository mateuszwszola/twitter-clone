import React from 'react';
import PropTypes from 'prop-types';
import ProfileStatGroup from './ProfileStatGroup';
import { EditProfileButton, FollowProfileButton } from 'shared/components';
import { ProfileHeaderMenu, HeaderMenuList } from './style';
import { Link } from 'react-router-dom';

const UserStatsHeader = ({ profile, owner, isAuthenticated, followed }) => {
  const { user, tweets, following, followers, likes } = profile;
  return (
    <ProfileHeaderMenu>
      <HeaderMenuList>
        <Link to={`/${user.username}`}>
          <ProfileStatGroup label="Tweets" value={tweets.length} />
        </Link>
        <Link to={`/${user.username}/following`}>
          <ProfileStatGroup label="Following" value={following.length} />
        </Link>
        <Link to={`/${user.username}/followers`}>
          <ProfileStatGroup label="Followers" value={followers.length} />
        </Link>
        <Link to={`/${user.username}/likes`}>
          <ProfileStatGroup label="Likes" value={likes.length} />
        </Link>
      </HeaderMenuList>
      {owner ? (
        <div>
          <EditProfileButton as={Link} primary="true" to="/edit-profile">
            Edit Profile
          </EditProfileButton>
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
};

UserStatsHeader.propTypes = {
  profile: PropTypes.object.isRequired,
  owner: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  followed: PropTypes.bool.isRequired
};

export default UserStatsHeader;
