import React from 'react';
import PropTypes from 'prop-types';
import ProfileUserGroup from './ProfileUserGroup';
import UserStatsHeader from 'components/layout/user/UserStatsHeader';
import TweetsBoard from 'components/layout/TweetsBoard';
import Loading from '../Loading';
import {
  Container,
  BackgroundContainer,
  Background,
  ProfileTweetsBoard,
  Sidebar
} from './style';
import { Route, Switch } from 'react-router-dom';
import Following from './Following';
import Followers from './Followers';
import Likes from './Likes';
import { connect } from 'react-redux';
import { followProfile } from 'actions/profileActions';

// const backgroundPlaceholderSrc =
//   'https://via.placeholder.com/1920x250?text=Background+Picture';

function ProfileTweets({ loading, tweets }) {
  return (
    <ProfileTweetsBoard>
      {loading || tweets === null ? (
        <Loading />
      ) : (
        <TweetsBoard tweets={tweets} />
      )}
    </ProfileTweetsBoard>
  );
}

ProfileTweets.propTypes = {
  loading: PropTypes.bool.isRequired,
  tweets: PropTypes.array
};

function Profile({
  profile,
  tweet: { loading, tweets },
  owner,
  isAuthenticated,
  followed,
  match,
  followProfile
}) {
  const handleFollowClick = () => {
    // followProfile()
  };

  return (
    <Container>
      <BackgroundContainer>
        {profile.user.backgroundPicture ? (
          <Background
            alt={`${profile.user.name} background`}
            src={profile.user.background}
          />
        ) : (
          ''
        )}
      </BackgroundContainer>
      <UserStatsHeader
        profile={profile}
        owner={owner}
        isAuthenticated={isAuthenticated}
        followed={followed}
      />
      <div>
        <ProfileUserGroup profile={profile} />
        <Switch>
          <Route
            exact
            path={`${match.path}`}
            render={() => <ProfileTweets loading={loading} tweets={tweets} />}
          />
          <Route path={`${match.path}/following`} component={Following} />
          <Route path={`${match.path}/followers`} component={Followers} />
          <Route path={`${match.path}/likes`} component={Likes} />
        </Switch>
        <Sidebar>Right sidebar</Sidebar>
      </div>
    </Container>
  );
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  tweet: PropTypes.object.isRequired,
  owner: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  followed: PropTypes.bool.isRequired,
  followProfile: PropTypes.func.isRequired
};

export default connect(
  null,
  { followProfile }
)(Profile);
