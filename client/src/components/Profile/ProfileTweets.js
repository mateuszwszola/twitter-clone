import React from 'react';
import PropTypes from 'prop-types';
import { ProfileTweetsBoard } from './style';
import TweetsBoard from 'components/layout/TweetsBoard';
import Loading from '../Loading';

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

export default ProfileTweets;
