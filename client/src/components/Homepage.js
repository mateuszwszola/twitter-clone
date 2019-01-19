import React from 'react';
import PropTypes from 'prop-types';
import TweetsBoard from './layout/TweetsBoard';
import UserPreview from './layout/UserPreview';

function Homepage({ profile }) {
  return (
    <div className="homepage-container container">
      <div className="homepage-left homepage-flex-item">
        <UserPreview profile={profile} />
      </div>
      <div className="homepage-mid homepage-flex-item">
        <TweetsBoard tweets={profile.tweets} />
      </div>
      <div className="homepage-right homepage-flex-item">Homepage Right</div>
    </div>
  );
}

Homepage.propTypes = {
  profile: PropTypes.object.isRequired
};

export default Homepage;
