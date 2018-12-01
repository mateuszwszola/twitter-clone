import React from 'react';
import PropTypes from 'prop-types';

export default function PrimaryButton({ type, text }) {
  return (
    <button type={type} className="button button--primary">
      {text}
    </button>
  );
}

PrimaryButton.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string.isRequired
};

PrimaryButton.defaultProps = {
  type: 'text'
};
