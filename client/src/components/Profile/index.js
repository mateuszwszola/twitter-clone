import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import { followProfile, unfollowProfile } from 'actions/profileActions';

import ProfileTweets from './ProfileTweets';
import Following from './Following';
import Followers from './Followers';
import Likes from './Likes';
import ProfileUserGroup from './ProfileUserGroup';
import UserStatsHeader from 'components/layout/user/UserStatsHeader';
import { Container, BackgroundContainer, Background, Sidebar } from './style';

function Profile({
  profile: { profile, loading },
  auth,
  followProfile,
  unfollowProfile,
  match
}) {
  const followed = !!(
    auth.user && profile.followers.find(user => user === auth.user._id)
  );
  const owner = !!(auth.user && auth.user._id === profile.user._id);
  function handleFollowButtonClick() {
    if (followed) {
      unfollowProfile(auth.user._id, profile.user._id);
    } else {
      followProfile(auth.user._id, profile.user._id);
    }
  }

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
        isAuthenticated={auth.isAuthenticated}
        followed={followed}
        handleFollowButtonClick={handleFollowButtonClick}
      />
      <div>
        <ProfileUserGroup profile={profile} />
        <Switch>
          <Route exact path={`${match.path}`} component={ProfileTweets} />
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
  auth: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  followProfile: PropTypes.func.isRequired,
  unfollowProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  tweet: state.tweet,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { followProfile, unfollowProfile }
)(withRouter(Profile));
