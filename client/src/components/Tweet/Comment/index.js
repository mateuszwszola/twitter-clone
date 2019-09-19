import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getComments, addComment } from "actions/commentActions";
import { likeTweet, removeTweet } from "actions/tweetActions";
import AddCommentForm from './AddCommentForm';
import CommentsList from './CommentsList';
import Loading from 'components/Loading';

function Comment({ tweetId, comment: { comments, loading }, getComments, addComment, likeTweet, removeTweet, auth, errors, history }) {
    useEffect(() => {
        getComments(tweetId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tweetId]);

    function handleAddComment(comment, clearInput) {
        addComment(tweetId, comment);
        clearInput();
    }

    function handleActionClick(e, action, comment_id) {
        e.stopPropagation();
        if (!auth.isAuthenticated) {
            history.push('/signin');
        } else {
            if (action === 'like') {
                likeTweet(comment_id, auth.user._id);
            } else if (action === 'remove') {
                removeTweet(comment_id);
            }
        }
    }

    return (
        <>
            <AddCommentForm
                handleAddComment={handleAddComment}
                errors={errors}
                userAvatar={auth.user && auth.user.avatar}
            />
            {!comments || loading ? (
                <Loading />
            ) : (
                <CommentsList comments={comments} auth={auth} handleActionClick={handleActionClick} />
            )}
        </>
    )
}

Comment.propTypes = {
    tweetId: PropTypes.string.isRequired,
    getComments: PropTypes.func.isRequired,
    addComment: PropTypes.func.isRequired,
    likeTweet: PropTypes.func.isRequired,
    removeTweet: PropTypes.func.isRequired,
    comment: PropTypes.object.isRequired,
    errors: PropTypes.array.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    comment: state.comment,
    errors: state.errors,
    auth: state.auth
});

export default connect(mapStateToProps, { getComments, addComment, likeTweet, removeTweet })(withRouter(Comment));