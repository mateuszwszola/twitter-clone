import { followUser, unfollowUser } from 'api/profile';
import { useAlert } from 'context/AlertContext';
import { useUser } from 'context/UserContext';
import { format } from 'date-fns';
import portraitPlaceholder from 'img/portrait-placeholder.png';
import PropTypes from 'prop-types';
import React from 'react';
import { FiCalendar, FiLink, FiMapPin, FiPlusCircle } from 'react-icons/fi';
import { useMutation, useQueryClient } from 'react-query';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import {
  EditProfileButton,
  FollowProfileButton,
  UserAvatar,
} from 'shared/components';
import Followers from './Followers';
import Following from './Following';
import Likes from './Likes';
import ProfileTweets from './ProfileTweets';
import {
  AddBackground,
  AddBackgroundButton,
  Background,
  BackgroundContainer,
  Container,
  HeaderMenuList,
  Key,
  ListItem,
  ProfileHeaderMenu,
  Value,
} from './style';

function Profile({ profile }) {
  const user = useUser();
  const match = useRouteMatch();
  const history = useHistory();
  const queryClient = useQueryClient();
  const { setAlert } = useAlert();
  const followMutation = useMutation((userId) => followUser(userId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['profiles', profile.user._id]);
    },
  });
  const unfollowMutation = useMutation((userId) => unfollowUser(userId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['profiles', profile.user._id]);
    },
  });

  const isFollowing = user && profile.followers.includes(user._id);
  const isProfileOwner = !!(user && user._id === profile.user._id);

  function handleFollowButtonClick() {
    if (!user) {
      return history.push('/signin');
    }
    if (isFollowing) {
      unfollowMutation.mutate(profile.user._id, {
        onError: (err) => {
          setAlert({ type: 'error', msg: 'Something went wrong...' });
        },
      });
    } else {
      followMutation.mutate(profile.user._id, {
        onError: (err) => {
          setAlert({ type: 'error', msg: 'Something went wrong...' });
        },
      });
    }
  }

  const {
    user: { name, username, avatar },
    location,
    bio,
    website,
    createdAt,
  } = profile;

  return (
    <Container>
      <div>
        <BackgroundContainer>
          {profile.backgroundImage ? (
            <Background
              alt={`${profile.user.name}'s background`}
              src={profile.backgroundImage}
            />
          ) : (
            <>
              {isProfileOwner && (
                <AddBackground>
                  <span>Add background picture</span>{' '}
                  <AddBackgroundButton as={Link} to="/edit-profile">
                    <FiPlusCircle />
                  </AddBackgroundButton>
                </AddBackground>
              )}
            </>
          )}
        </BackgroundContainer>

        <div
          css={`
            padding: 0 15px;
          `}
        >
          <div
            css={`
              display: flex;
              justify-content: space-between;
            `}
          >
            <div
              css={`
                position: relative;
                transform: translateY(-75px);
              `}
            >
              <UserAvatar
                css={`
                  border: 2px solid #eee;
                  margin: 0;
                  background-color: white;
                `}
                src={avatar || portraitPlaceholder}
                alt={`${name}'s avatar`}
              />
              <span
                css={`
                  font-size: 1.25rem;
                  font-weight: bold;
                  display: block;
                `}
              >
                {name}
              </span>
              <span
                css={`
                  color: ${(props) => props.theme.colors.gray};
                  display: block;
                `}
              >
                @{username}
              </span>
            </div>

            <div
              css={`
                margin-top: 15px;
              `}
            >
              {isProfileOwner ? (
                <EditProfileButton as={Link} primary="true" to="/edit-profile">
                  Edit Profile
                </EditProfileButton>
              ) : (
                <FollowProfileButton primary onClick={handleFollowButtonClick}>
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </FollowProfileButton>
              )}
            </div>
          </div>

          <div>
            {bio && (
              <div
                css={`
                  margin: 15px 0;
                `}
              >
                {bio}
              </div>
            )}

            <div
              css={`
                display: flex;
                align-items: center;
                margin: 15px 0;
                div {
                  margin-left: 20px;
                  &:first-child {
                    margin-left: 0;
                  }
                }
              `}
            >
              {location && (
                <div>
                  <FiMapPin />
                  {location}
                </div>
              )}
              {website && (
                <div>
                  <FiLink /> {website}
                </div>
              )}
              <div>
                <FiCalendar /> Joined {format(new Date(createdAt), 'MMMM yyyy')}
              </div>
            </div>

            <ProfileHeaderMenu>
              <HeaderMenuList>
                <ListItem
                  as={Link}
                  to={`/profile/${profile.user._id}/following`}
                >
                  <Key>Following</Key>
                  <Value>{profile.following.length}</Value>
                </ListItem>

                <ListItem
                  as={Link}
                  to={`/profile/${profile.user._id}/followers`}
                >
                  <Key>Followers</Key>
                  <Value>{profile.followers.length}</Value>
                </ListItem>

                <ListItem as={Link} to={`/profile/${profile.user._id}/likes`}>
                  <Key>Likes</Key>
                  <Value>{profile.likes.length}</Value>
                </ListItem>
              </HeaderMenuList>
            </ProfileHeaderMenu>
          </div>
        </div>
      </div>

      <div>
        <Switch>
          <Route exact path={`${match.path}`} component={ProfileTweets} />
          <Route path={`${match.path}/following`} component={Following} />
          <Route path={`${match.path}/followers`} component={Followers} />
          <Route path={`${match.path}/likes`} component={Likes} />
        </Switch>
      </div>
    </Container>
  );
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default Profile;
