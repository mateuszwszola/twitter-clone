import React from 'react';
import PropTypes from 'prop-types';
import { Input, FeedbackMessage } from 'shared/components';

export default function InputGroup({
  type,
  name,
  value,
  onChange,
  placeholder,
  error,
  errorMsg,
  ...rest
}) {
  return (
    <div>
      <Input
        isError={!!error}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
      />
      {errorMsg ? <FeedbackMessage>{errorMsg}</FeedbackMessage> : null}
    </div>
  );
}

InputGroup.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
};

InputGroup.defaultProps = {
  type: 'text',
  placeholder: 'Type here.',
};
