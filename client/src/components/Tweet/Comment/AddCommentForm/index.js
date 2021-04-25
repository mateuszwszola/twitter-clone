import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  CommentContainer,
  CommentForm,
  CommentInput,
} from 'components/Tweet/Comment/AddCommentForm/style';
import { UserAvatar } from 'shared/components';
import portraitPlaceholder from 'img/portrait-placeholder.png';

function AddCommentForm({
  handleSubmit,
  handleChange,
  userAvatar,
  commentText,
}) {
  return (
    <CommentContainer>
      <UserAvatar
        tiny
        src={userAvatar || portraitPlaceholder}
        alt="User Avatar"
      />
      <CommentForm onSubmit={handleSubmit}>
        <CommentInput
          placeholder="Tweet your reply"
          type="text"
          value={commentText}
          onChange={handleChange}
        />
      </CommentForm>
    </CommentContainer>
  );
}

AddCommentForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  commentText: PropTypes.string.isRequired,
  userAvatar: PropTypes.string,
};

function AddCommentFormContainer({ handleAddComment, userAvatar, errors }) {
  const [comment, setComment] = useState('');

  function handleChange(e) {
    const { value } = e.target;
    setComment(value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleAddComment({ text: comment }, () => setComment(''));
  }

  return (
    <AddCommentForm
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      commentText={comment}
      userAvatar={userAvatar}
      errors={errors}
    />
  );
}

AddCommentFormContainer.propTypes = {
  handleAddComment: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired,
  userAvatar: PropTypes.string,
};

export default AddCommentFormContainer;
