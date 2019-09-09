import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loading from 'components/Loading';
import { getTweetById, removeTweet, likeTweet } from 'actions/tweetActions';
import { TweetContainer } from './style';

function TweetView({ handleActionClick, tweet, liked }) {
  return <TweetContainer/>
}

TweetView.propTypes = {
  handleActionClick: PropTypes.func.isRequired,
  tweet: PropTypes.object.isRequired,
  liked: PropTypes.bool.isRequired
};

function TweetViewContainer({
  match,
  history,
  auth,
  tweet: { tweet, loading },
  errors,
  getTweetById,
  removeTweet,
  likeTweet
}) {
  const { status_id } = match.params;

  useEffect(() => {
    if (!tweet && !loading) {
      getTweetById(status_id);
    }
  }, [status_id]);

  const pushToLogin = () => history.push('/signin');
  const handleActionClick = (e, action, tweet_id) => {
    e.stopPropagation();
    if (auth.isAuthenticated) {
      if (action === 'like') {
        likeTweet(tweet_id, auth.user._id);
      } else if (action === 'remove') {
        removeTweet(tweet_id);
      }
    } else {
      pushToLogin();
    }
  };

  if (loading || !tweet) {
    return <Loading />;
  }

  const liked = !!(
    auth.user && tweet.likes.find(like => like.user === auth.user._id)
  );

  return (
    <TweetView
      handleActionClick={handleActionClick}
      tweet={tweet}
      liked={liked}
    />
  );
}

TweetViewContainer.propTypes = {
  errors: PropTypes.object.isRequired,
  tweet: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  tweet: state.tweet,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getTweetById, removeTweet, likeTweet }
)(TweetViewContainer);
