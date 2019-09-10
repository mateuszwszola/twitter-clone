import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getComments, addComment } from "actions/commentActions";
import AddComment from './AddComment';
import TweetsBoard from "components/layout/TweetsBoard";
import Loading from 'components/Loading';

function Comment({ tweetId, comment: { comments, loading }, getComments, addComment }) {
    useEffect(() => {
        getComments(tweetId);
    }, [tweetId]);

    if (comments === null || loading) {
        return <Loading />;
    }

    return (
        <>
            <AddComment />
            <TweetsBoard comments={true} tweets={comments} />
        </>
    )
}

Comment.propTypes = {
    tweetId: PropTypes.string.isRequired,
    getComments: PropTypes.func.isRequired,
    addComment: PropTypes.func.isRequired,
    comment: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    comment: state.comment,
});

export default connect(mapStateToProps, { getComments, addComment })(Comment);