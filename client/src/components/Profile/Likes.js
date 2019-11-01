import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUserLikeTweets } from 'actions/tweetActions';
import TweetsBoard from 'components/layout/TweetsBoard';
import { ProfileTweetsBoard } from "./style";

function Likes(
    {
      tweet: { tweets, loading },
      profile: { profile },
      getUserLikeTweets
    }) {

  useEffect(() => {
    getUserLikeTweets(profile.user._id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.user._id]);

  return (
      <ProfileTweetsBoard>
          <TweetsBoard loading={loading} tweets={tweets} />
      </ProfileTweetsBoard>
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
