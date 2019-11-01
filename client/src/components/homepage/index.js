import React from 'react';
import PropTypes from 'prop-types';
import TweetsBoard from '../layout/TweetsBoard';
import UserPreview from '../layout/UserPreview';
import { Container, LeftSidebar, Main } from './style';

function Homepage({ profile, tweet }) {
  return (
    <Container>
      <LeftSidebar>
        <UserPreview profile={profile} />
      </LeftSidebar>
      <Main>
          <TweetsBoard loading={tweet.loading} tweets={tweet.tweets} />
      </Main>
       {/*<RightSidebar>*/}
       {/*</RightSidebar>*/}
    </Container>
  );
}

Homepage.propTypes = {
  profile: PropTypes.object.isRequired,
  tweet: PropTypes.object
};

export default Homepage;
