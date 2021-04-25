import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Link, useRouteMatch } from 'react-router-dom';
import ProfileTweets from './ProfileTweets';
import Following from './Following';
import Followers from './Followers';
import Likes from './Likes';
import portraitPlaceholder from 'img/portrait-placeholder.png';
import {
  Container,
  BackgroundContainer,
  Background,
  PagesContainer,
  AddBackground,
  AddBackgroundButton,
  ProfileHeaderMenu,
  HeaderMenuList,
  ListItem,
  Key,
  Value,
  StyledUserName,
  UserInfoLink,
  UserInfoJoined,
} from './style';
import { useUser } from 'context/UserContext';
import { useMutation } from 'react-query';
import { followUser, unfollowUser } from 'api/profile';
import { FaCalendarAlt } from 'react-icons/fa';
import {
  EditProfileButton,
  FollowProfileButton,
  UserAvatar,
} from 'shared/components';
import { format } from 'date-fns';

function ProfilePreview({ profile }) {
  const {
    user: { _id: profileId, name, username, avatar },
    location,
    bio,
    website,
    createdAt,
  } = profile;

  return (
    <div>
      <UserAvatar
        src={avatar || portraitPlaceholder}
        alt={`${name}'s avatar`}
      />
      <StyledUserName>
        <UserInfoLink to={`/profile/${profileId}`}>{name}</UserInfoLink>
      </StyledUserName>
      <StyledUserName>
        <UserInfoLink to={`/profile/${profileId}`}>{username}</UserInfoLink>
      </StyledUserName>
      {location && <p>Location: {location}</p>}
      {bio && <p>Bio: {bio}</p>}
      {website && <p>Website: {website}</p>}
      <UserInfoJoined>
        <FaCalendarAlt /> Joined {format(new Date(createdAt), 'MMMM yyyy')}
      </UserInfoJoined>
    </div>
  );
}

ProfilePreview.propTypes = {
  profile: PropTypes.object.isRequired,
};

function Profile({ profile }) {
  const user = useUser();
  const match = useRouteMatch();
  const followMutation = useMutation((userId) => followUser(userId));
  const unfollowMutation = useMutation((userId) => unfollowUser(userId));

  const isFollowing = user && profile.followers.includes(user._id);
  const isProfileOwner = !!(user && user._id === profile.user._id);

  function handleFollowButtonClick() {
    if (isFollowing) {
      unfollowMutation.mutate(profile.user._id);
    } else {
      followMutation.mutate(profile.user._id);
    }
  }

  return (
    <Container>
      <BackgroundContainer>
        {profile.backgroundImage ? (
          <Background
            alt={`${profile.user.name} background`}
            src={profile.backgroundImage}
          />
        ) : (
          <AddBackground>
            {isProfileOwner ? (
              <>
                <span>Add background picture</span>{' '}
                <AddBackgroundButton
                  className="fas fa-plus-circle"
                  as={Link}
                  to="/edit-profile"
                />
              </>
            ) : (
              ''
            )}
          </AddBackground>
        )}
      </BackgroundContainer>

      <ProfileHeaderMenu>
        <HeaderMenuList>
          <ListItem as={Link} to={`/profile/${profile.user._id}/following`}>
            <Key>Following</Key>
            <Value>{profile.following.length}</Value>
          </ListItem>

          <ListItem as={Link} to={`/profile/${profile.user._id}/followers`}>
            <Key>Followers</Key>
            <Value>{profile.followers.length}</Value>
          </ListItem>

          <ListItem as={Link} to={`/profile/${profile.user._id}/likes`}>
            <Key>Likes</Key>
            <Value>{profile.likes.length}</Value>
          </ListItem>
        </HeaderMenuList>
        {isProfileOwner ? (
          <div>
            <EditProfileButton as={Link} primary="true" to="/edit-profile">
              Edit Profile
            </EditProfileButton>
          </div>
        ) : (
          <div>
            {user ? (
              <FollowProfileButton primary onClick={handleFollowButtonClick}>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </FollowProfileButton>
            ) : (
              ''
            )}
          </div>
        )}
      </ProfileHeaderMenu>

      <div>
        <ProfilePreview profile={profile} />
        <PagesContainer>
          <Switch>
            <Route exact path={`${match.path}`} component={ProfileTweets} />
            <Route path={`${match.path}/following`} component={Following} />
            <Route path={`${match.path}/followers`} component={Followers} />
            <Route path={`${match.path}/likes`} component={Likes} />
          </Switch>
        </PagesContainer>
      </div>
    </Container>
  );
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default Profile;
