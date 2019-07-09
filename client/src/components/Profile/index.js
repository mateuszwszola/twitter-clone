import React from 'react';
import PropTypes from 'prop-types';
import ProfileUserGroup from './ProfileUserGroup';
import UserStatsHeader from 'components/layout/user/UserStatsHeader';
import TweetsBoard from 'components/layout/TweetsBoard';
import Loading from '../Loading';
import { Container, BackgroundContainer, Background, ProfileTweetsBoard, Sidebar } from './style';

const backgroundPlaceholderSrc = "https://via.placeholder.com/1280x250?text=Background+Picture";

function Profile({ profile, tweet, owner, isAuthenticated, followed }) {
  return (
    <Container>
        <BackgroundContainer>
            <Background alt={`${profile.user.name} background`} src={profile.user.background || backgroundPlaceholderSrc} />
        </BackgroundContainer>
        <UserStatsHeader
          profile={profile}
          owner={owner}
          isAuthenticated={isAuthenticated}
          followed={followed}
        />
      <div>
          <ProfileUserGroup profile={profile} />
        <ProfileTweetsBoard>
          {tweet.loading || tweet.tweets === null ? (
            <Loading />
          ) : (
            <TweetsBoard tweets={tweet.tweets} />
          )}
        </ProfileTweetsBoard>
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
  followed: PropTypes.bool.isRequired
};

export default Profile;
