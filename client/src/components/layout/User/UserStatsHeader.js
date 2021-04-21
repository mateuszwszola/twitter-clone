import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ProfileStatGroup from './ProfileStatGroup';
import { EditProfileButton, FollowProfileButton } from 'shared/components';
import { ProfileHeaderMenu, HeaderMenuList } from './style';

const UserStatsHeader = ({
  profile,
  owner,
  isAuthenticated,
  followed,
  handleFollowButtonClick,
}) => {
  const { user, following, followers, likes } = profile;

  return (
    <ProfileHeaderMenu>
      <HeaderMenuList>
        <Link to={`/${user._id}`}>
          <ProfileStatGroup label="Tweets" />
        </Link>
        <Link to={`/${user._id}/following`}>
          <ProfileStatGroup label="Following" value={following.length} />
        </Link>
        <Link to={`/${user._id}/followers`}>
          <ProfileStatGroup label="Followers" value={followers.length} />
        </Link>
        <Link to={`/${user._id}/likes`}>
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
            <FollowProfileButton primary onClick={handleFollowButtonClick}>
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
  followed: PropTypes.bool.isRequired,
  handleFollowButtonClick: PropTypes.func.isRequired,
};

export default UserStatsHeader;
