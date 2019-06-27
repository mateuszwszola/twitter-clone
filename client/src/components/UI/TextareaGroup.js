import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

const Feedback = styled.div`
  color: red;
  padding: 5px 0;
`;

const TextareaGroup = ({
  textarea: Textarea,
  text,
  handleChange,
  handleEnterPress,
  placeholder,
  error,
  errorMsg
}) => (
  <React.Fragment>
    <Textarea
      value={text}
      onChange={handleChange}
      onKeyUp={handleEnterPress}
      placeholder={placeholder}
      error={error}
    />
    {errorMsg ? <Feedback>{errorMsg}</Feedback> : ''}
  </React.Fragment>
);

TextareaGroup.propTypes = {
  text: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleEnterPress: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  error: PropTypes.bool,
  errorMsg: PropTypes.string.isRequired
};

export default TextareaGroup;
