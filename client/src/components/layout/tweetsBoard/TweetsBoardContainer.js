import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setCurrentTweet, likeTweet, removeTweet } from 'actions/tweetActions';
import TweetsBoard from './TweetsBoard';

function TweetsBoardContainer({
    tweets,
    setCurrentTweet,
    likeTweet,
    removeTweet,
    auth,
    history
                     }) {
    function handleTweetClick(tweet) {
        const { user, _id } = tweet;
        setCurrentTweet(tweet);
        history.push({
            pathname: `/${user.username}/status/${_id}`,
            state: { modal: true }
        });
    }

    function handleActionClick(e, action, tweet_id) {
        e.stopPropagation();
        if (auth.isAuthenticated) {
            if (action === 'like') {
                likeTweet(tweet_id, auth.user._id);
            } else if (action === 'remove') {
                removeTweet(tweet_id);
            }
        } else {
            history.push({
                pathname: '/signin'
            });
        }
    }

    return (
            <TweetsBoard
                tweets={tweets}
                auth={auth}
                handleActionClick={handleActionClick}
                handleTweetClick={handleTweetClick}
            />
    );
}

TweetsBoardContainer.propTypes = {
    tweets: PropTypes.array.isRequired,
    setCurrentTweet: PropTypes.func.isRequired,
    likeTweet: PropTypes.func.isRequired,
    removeTweet: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { setCurrentTweet, likeTweet, removeTweet }
)(withRouter(TweetsBoardContainer));
