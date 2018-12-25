import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function InputGroup({
  type,
  name,
  value,
  onChange,
  placeholder,
  error,
  errorMsg
}) {
  return (
    <div className="input-group">
      <input
        className={classnames('input', `input--${type}`, {
          'input--error': error
        })}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {errorMsg ? <div className="invalid-feedback">{errorMsg}</div> : null}
    </div>
  );
}

InputGroup.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.bool.isRequired
};

InputGroup.defaultProps = {
  type: 'text',
  placeholder: 'Type here.'
};
