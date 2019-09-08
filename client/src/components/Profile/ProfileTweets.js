import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TweetsBoard from 'components/layout/TweetsBoard';
import Loading from '../Loading';
import { getUserTweets } from 'actions/tweetActions';
import { ProfileTweetsBoard } from './style';

function ProfileTweets({
  profile: { profile },
  tweet: { loading, tweets },
  getUserTweets
}) {
  useEffect(() => {
    getUserTweets(profile.user._id);
  }, [profile.user._id]);
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
  tweet: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getUserTweets: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  tweet: state.tweet,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getUserTweets }
)(ProfileTweets);
