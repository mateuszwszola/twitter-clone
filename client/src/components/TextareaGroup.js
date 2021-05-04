import React from 'react';
import PropTypes from 'prop-types';
import { FeedbackMessage } from 'shared/components';

const TextareaGroup = ({
  textarea: Textarea,
  text,
  handleChange,
  handleEnterPress,
  placeholder,
  error,
  errorMsg,
}) => (
  <React.Fragment>
    <Textarea
      value={text}
      onChange={handleChange}
      onKeyUp={handleEnterPress}
      placeholder={placeholder}
      error={error}
    />
    {errorMsg ? <FeedbackMessage>{errorMsg}</FeedbackMessage> : ''}
  </React.Fragment>
);

TextareaGroup.propTypes = {
  text: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleEnterPress: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  error: PropTypes.bool,
  errorMsg: PropTypes.string,
};

export default TextareaGroup;
