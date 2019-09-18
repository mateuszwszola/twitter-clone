import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getComments, addComment } from "actions/commentActions";
import AddCommentForm from './AddCommentForm';
import CommentsList from './CommentsList';
import Loading from 'components/Loading';

function Comment({ tweetId, comment: { comments, loading }, getComments, addComment, auth, errors }) {
    useEffect(() => {
        getComments(tweetId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tweetId]);

    function handleAddComment(comment, clearInput) {
        addComment(tweetId, comment);
        clearInput();
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
                <CommentsList comments={comments} auth={auth} />
            )}
        </>
    )
}

Comment.propTypes = {
    tweetId: PropTypes.string.isRequired,
    getComments: PropTypes.func.isRequired,
    addComment: PropTypes.func.isRequired,
    comment: PropTypes.object.isRequired,
    errors: PropTypes.array.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    comment: state.comment,
    errors: state.errors,
    auth: state.auth
});

export default connect(mapStateToProps, { getComments, addComment })(Comment);