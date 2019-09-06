import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUserLikeTweets } from 'actions/tweetActions';
import Loading from '../Loading';
import TweetsBoard from 'components/layout/TweetsBoard';

function Likes(
    {
      tweet: { tweets, loading },
      profile: { profile },
      errors,
      getUserLikeTweets
    }) {
  useEffect(() => {
    getUserLikeTweets(profile.user._id);
  }, [profile.user._id]);

  if (tweets === null || loading) {
    return <Loading />;
  }

  return (
      <>
        <TweetsBoard
          tweets={tweets}
        />
      </>
  )
}

const mapStateToProps = state => ({
  tweet: state.tweet,
  profile: state.profile,
  errors: state.errors
});

Likes.propTypes = {
  tweet: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.array.isRequired,
  getUserLikeTweets: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { getUserLikeTweets })(Likes);
