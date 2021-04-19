import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTweets } from 'actions/tweetActions';
import TweetsBoard from 'components/layout/TweetsBoard';
import { ProfileTweetsBoard } from './style';

function Likes({
  tweet: { tweets, loading },
  profile: { profile },
  getTweets,
}) {
  useEffect(() => {
    getTweets(`?likes=${profile.user._id}`);
  }, [profile.user._id]);

  return (
    <ProfileTweetsBoard>
      <TweetsBoard loading={loading} tweets={tweets} />
    </ProfileTweetsBoard>
  );
}

const mapStateToProps = (state) => ({
  tweet: state.tweet,
  profile: state.profile,
  errors: state.errors,
});

Likes.propTypes = {
  tweet: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getTweets: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { getTweets })(Likes);
