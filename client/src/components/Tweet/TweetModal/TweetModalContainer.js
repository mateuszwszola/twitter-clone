import React, { useEffect, useRef } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import Loading from "components/Loading";
import { getTweetById, likeTweet, removeTweet } from "actions/tweetActions";
import TweetModal from './TweetModal';

export function TweetModalContainer(
    {
        match,
        auth,
        tweet: { tweet, loading},
        getTweetById,
        likeTweet,
        removeTweet,
        history
    }) {
    const { status_id } = match.params;
    const containerRef = useRef(null);
    const closeButtonRef = useRef(null);

    useEffect(() => {
        if (!tweet) {
            getTweetById(status_id);
        }
    }, [status_id, tweet]);

    function back(e) {
        if (
            e.target === containerRef.current ||
            e.target === closeButtonRef.current
        ) {
            history.goBack();
        }
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
            history.push('/signin');
        }
    }

    if (loading || !tweet) {
        return <Loading />;
    }

    const liked = !!(
        auth.user && tweet.likes.find(like => like.user === auth.user._id)
    );

    return (
        <TweetModal
            containerRef={containerRef}
            closeButtonRef={closeButtonRef}
            back={back}
            tweet={tweet}
            liked={liked}
            handleActionClick={handleActionClick}
        />
    );
}

TweetModalContainer.propTypes = {
    auth: PropTypes.object.isRequired,
    tweet: PropTypes.object.isRequired,
    errors: PropTypes.array.isRequired,
    getTweetById: PropTypes.func.isRequired,
    removeTweet: PropTypes.func.isRequired,
    likeTweet: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    tweet: state.tweet,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { getTweetById, removeTweet, likeTweet }
)(withRouter(TweetModalContainer));