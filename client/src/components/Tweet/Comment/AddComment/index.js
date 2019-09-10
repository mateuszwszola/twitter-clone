import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CommentContainer, CommentForm, CommentInput } from 'components/Tweet/Comment/AddComment/style';
import { UserAvatar } from 'shared/components';
import portretPlaceholder from 'img/portret-placeholder.png';

function AddComment({ handleSubmit, handleChange, comment }) {
  return (
    <CommentContainer>
      <UserAvatar
        tiny
        src={portretPlaceholder} // user avatar
        alt="User Avatar"
      />
      <CommentForm onSubmit={handleSubmit}>
        <CommentInput
          placeholder="Tweet your reply"
          type="text"
          value={comment}
          onChange={handleChange}
        />
      </CommentForm>
    </CommentContainer>

  );
}

AddComment.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  comment: PropTypes.string.isRequired
};

function AddCommentContainer(props) {
  const [comment, setComment] = useState('');

  function handleChange(e) {
    const { value } = e.target;
    setComment(value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log({ comment });
  }

  return (
    <AddComment
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      comment={comment}
    />
  );
}

export default AddCommentContainer;
