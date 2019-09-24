import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Link } from 'react-router-dom';
import { followProfile, unfollowProfile } from 'actions/profileActions';

import ProfileTweets from './ProfileTweets';
import Following from './Following';
import Followers from './Followers';
import Likes from './Likes';
import NotFoundPage from 'components/NotFoundPage';
import ProfileUserGroup from './ProfileUserGroup';
import UserStatsHeader from 'components/layout/user/UserStatsHeader';
import { Container, BackgroundContainer, Background, PagesContainer, AddBackground, AddBackgroundButton } from './style';

function Profile({
  profile: { profile },
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
        {(profile.backgroundPicture) ? (
          <Background
            alt={`${profile.user.name} background`}
            src={profile.backgroundPicture}
          />
        ) : (
          <AddBackground>
            {owner ? (
              <>
                <span>Add background picture</span>
                {' '}
                <AddBackgroundButton
                    className="fas fa-plus-circle"
                    as={Link}
                    to="/edit-profile"
                />
              </>
            ) : ''}
          </AddBackground>
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
        <PagesContainer>
          <Switch>
            <Route exact path={`${match.path}`} component={ProfileTweets} />
            <Route path={`${match.path}/following`} component={Following} />
            <Route path={`${match.path}/followers`} component={Followers} />
            <Route path={`${match.path}/likes`} component={Likes} />
            <Route component={NotFoundPage} />
          </Switch>
        </PagesContainer>
         {/*<Sidebar>Right sidebar</Sidebar>*/}
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
