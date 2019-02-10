import React from 'react';
import PropTypes from 'prop-types';
import TweetsBoard from './layout/TweetsBoard';
import UserPreview from './layout/UserPreview';
import Loading from './Loading';

function Homepage({ profile, tweet }) {
  return (
    <div className="homepage-container container">
      <div className="homepage-left homepage-flex-item">
        <UserPreview profile={profile} />
      </div>
      <div className="homepage-mid homepage-flex-item">
        {tweet.loading || tweet.tweets === null ? (
          <Loading />
        ) : (
          <TweetsBoard tweets={tweet.tweets} />
        )}
      </div>
      <div className="homepage-right homepage-flex-item">Homepage Right</div>
    </div>
  );
}

Homepage.propTypes = {
  profile: PropTypes.object.isRequired,
  tweet: PropTypes.object.isRequired
};

export default Homepage;
