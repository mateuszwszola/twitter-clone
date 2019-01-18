import React from 'react';
import PropTypes from 'prop-types';
import TweetsBoard from './layout/TweetsBoard';
import UserPreview from './layout/User/UserPreview';

function Homepage({ profile }) {
  return (
    <div className="homepage-container">
      <div className="homepage-left">
        <UserPreview profile={profile} />
      </div>
      <div className="homepage-mid">
        <TweetsBoard tweets={profile.tweets} />
      </div>
    </div>
  );
}

Homepage.propTypes = {
  profile: PropTypes.object.isRequired
};

export default Homepage;
