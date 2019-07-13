import React, { useState } from 'react';
import PropTypes from 'prop-types';

function AddComment(props) {
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
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={comment} onChange={handleChange} />
        <button>Add Comment</button>
      </form>
    </div>
  );
}

export default AddComment;
