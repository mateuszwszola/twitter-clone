import { useUser } from 'context/UserContext';
import { format } from 'date-fns';
import portraitPlaceholder from 'img/portrait-placeholder.png';
import PropTypes from 'prop-types';
import React from 'react';
import { FiCalendar, FiLink, FiMapPin, FiPlusCircle } from 'react-icons/fi';
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
import { queries } from 'shared/layout';
import 'styled-components/macro';
import {
  useProfileFollowMutation,
  useProfileUnfollowMutation,
} from 'utils/profiles';
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
} from './style';

function Profile({ profile }) {
  const user = useUser();
  const match = useRouteMatch();
  const history = useHistory();
  const followMutation = useProfileFollowMutation();
  const unfollowMutation = useProfileUnfollowMutation();

  const isFollowing = user && profile.followers.includes(user._id);
  const isProfileOwner = !!(user && user._id === profile.user._id);

  const handleFollowButtonClick = () => {
    if (!user) {
      return history.push('/signin');
    }

    if (isFollowing) {
      unfollowMutation.mutate(profile.user._id);
    } else {
      followMutation.mutate(profile.user._id);
    }
  };

  const {
    user: { name, username, avatar },
    location,
    bio,
    website,
    createdAt,
  } = profile;

  return (
    <Container>
      <div
        css={`
          border: 1px solid #eee;
        `}
      >
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
                  <span>Add background</span>{' '}
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
          <div>
            <div
              css={`
                display: flex;
                justify-content: space-between;
              `}
            >
              <div
                css={`
                  position: relative;
                  transform: translateY(-50%);
                `}
              >
                <UserAvatar
                  css={`
                    border: 2px solid #eee;
                    margin: 0;
                    background-color: white;
                    ${[queries.tiny]} {
                      width: 100px;
                      height: 100px;
                    }
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

              <div>
                {isProfileOwner ? (
                  <EditProfileButton
                    css={`
                      display: block;
                    `}
                    as={Link}
                    primary="true"
                    to="/edit-profile"
                  >
                    Edit Profile
                  </EditProfileButton>
                ) : (
                  <FollowProfileButton
                    primary
                    onClick={handleFollowButtonClick}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </FollowProfileButton>
                )}
              </div>
            </div>

            <div
              css={`
                margin-top: -60px;
              `}
            >
              {bio && <div>{bio}</div>}

              <div
                css={`
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  margin: 30px 0;

                  div {
                    margin-top: 15px;
                    &:first-child {
                      margin-top: 0;
                    }
                  }

                  ${queries.phone} {
                    flex-direction: row;

                    div {
                      margin-top: 0;
                      margin-left: 20px;
                      &:first-child {
                        margin-left: 0;
                      }
                    }
                  }
                `}
              >
                {location && (
                  <div>
                    <FiMapPin /> {location}
                  </div>
                )}
                {website && (
                  <div>
                    <FiLink /> {website}
                  </div>
                )}
                <div>
                  <FiCalendar /> Joined{' '}
                  {format(new Date(createdAt), 'MMMM yyyy')}
                </div>
              </div>

              <div
                css={`
                  color: ${(props) => props.theme.colors.darkGray};
                  display: flex;
                  justify-content: center;
                  margin: 30px 0;

                  a {
                    margin-left: 10px;
                    &:first-child {
                      margin-left: 0;
                    }
                  }

                  ${queries.phone} {
                    justify-content: flex-start;
                    margin-left: 15px;
                  }
                `}
              >
                <Link to={`/profile/${profile.user._id}/following`}>
                  <span
                    css={`
                      color: black;
                      font-weight: bold;
                    `}
                  >
                    {profile.following.length}
                  </span>
                  <span> Following</span>
                </Link>
                <Link to={`/profile/${profile.user._id}/followers`}>
                  <span
                    css={`
                      color: black;
                      font-weight: bold;
                    `}
                  >
                    {profile.followers.length}
                  </span>
                  <span> Followers</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <ProfileHeaderMenu>
          <HeaderMenuList>
            <ListItem as={Link} to={`/profile/${profile.user._id}`}>
              <Key>Tweets</Key>
            </ListItem>

            <ListItem as={Link} to={`/profile/${profile.user._id}/likes`}>
              <Key>Likes</Key>
            </ListItem>
          </HeaderMenuList>
        </ProfileHeaderMenu>

        <div
          css={`
            border-top: 1px solid #eee;
          `}
        >
          <Switch>
            <Route exact path={`${match.path}`} component={ProfileTweets} />
            <Route path={`${match.path}/following`} component={Following} />
            <Route path={`${match.path}/followers`} component={Followers} />
            <Route path={`${match.path}/likes`} component={Likes} />
          </Switch>
        </div>
      </div>
    </Container>
  );
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default Profile;
