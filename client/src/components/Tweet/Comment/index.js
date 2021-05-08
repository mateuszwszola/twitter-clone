import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useUser } from 'context/UserContext';
import { useCreateTweet, useTweets } from 'utils/tweets';
import DisplayError from 'components/DisplayError';
import TweetsBoard from 'components/TweetsBoard';
import { CommentContainer, CommentForm, CommentInput } from './style';
import { UserAvatar } from 'shared/components';
import portraitPlaceholder from 'img/portrait-placeholder.png';

function validateComment(comment) {
  if (comment.text.length < 1 || comment.text.length > 280) {
    return false;
  }
  return true;
}

function Comment({ tweetId }) {
  const {
    status,
    error,
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTweets({ replyTo: tweetId });
  const user = useUser();
  const createTweetMutation = useCreateTweet();
  const [comment, setComment] = useState('');

  const handleAddComment = (e) => {
    e.preventDefault();

    if (validateComment({ text: comment })) {
      createTweetMutation.mutate(
        { text: comment, replyTo: tweetId },
        {
          onSuccess: () => {
            setComment('');
          },
        }
      );
    }
  };

  if (error) {
    return <DisplayError error={error} />;
  }

  return (
    <>
      {createTweetMutation.isError && (
        <DisplayError error={createTweetMutation.error} />
      )}
      <CommentContainer>
        <UserAvatar
          tiny
          src={user?.avatar || portraitPlaceholder}
          alt="User Avatar"
        />
        <CommentForm onSubmit={handleAddComment}>
          <CommentInput
            placeholder="Tweet your reply"
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </CommentForm>
      </CommentContainer>
      <TweetsBoard
        queryKey={['tweets', { replyTo: tweetId }]}
        loading={status === 'loading'}
        pages={data?.pages || []}
        headerText="Replies"
        isFetching={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
}

Comment.propTypes = {
  tweetId: PropTypes.string.isRequired,
};

export default Comment;
