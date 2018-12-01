import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function InputGroup({
  type,
  name,
  value,
  onChange,
  placeholder,
  error
}) {
  return (
    <div className="input-group">
      <input
        className={classnames('input', `input--${type}`)}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

InputGroup.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

InputGroup.defaultProps = {
  type: 'text',
  placeholder: 'Type here.'
};
