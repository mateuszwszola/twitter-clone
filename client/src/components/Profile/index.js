import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Link, useRouteMatch } from 'react-router-dom';
import ProfileTweets from './ProfileTweets';
import Following from './Following';
import Followers from './Followers';
import Likes from './Likes';
import ProfileUserGroup from './ProfileUserGroup';
import UserStatsHeader from 'components/layout/user/UserStatsHeader';
import {
  Container,
  BackgroundContainer,
  Background,
  PagesContainer,
  AddBackground,
  AddBackgroundButton,
} from './style';
import { useUser } from 'context/UserContext';
import { useMutation } from 'react-query';
import { followUser, unfollowUser } from 'api/profile';

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
      <UserStatsHeader
        profile={profile}
        owner={isProfileOwner}
        isAuthenticated={!!user}
        followed={isFollowing}
        handleFollowButtonClick={handleFollowButtonClick}
      />
      <div>
        <ProfileUserGroup profile={profile} />
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
