import React from 'react';
import PropTypes from 'prop-types';
import InputGroup from './UI/InputGroup';

function CreateTweet({ text, errors, handleChange, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        name="text"
        value={text}
        onChange={handleChange}
        placeholder="Type Here Tweet text"
        error={errors.text ? true : false}
        errorMsg={errors.text ? errors.text : null}
      />
      <button type="submit">Create Tweet</button>
    </form>
  );
}

CreateTweet.propTypes = {
  text: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default CreateTweet;
