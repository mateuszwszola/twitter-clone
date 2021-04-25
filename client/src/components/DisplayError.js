import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';

function Error({ error }) {
  if (!error) {
    return null;
  }

  const errorMessage = error.response?.data?.message || error.message;

  return (
    <div
      css={`
        margin: 15px auto;
        text-align: center;
      `}
    >
      <p
        css={`
          font-weight: bold;
          font-size: 1em;
        `}
      >
        An error has occurred: {errorMessage || 'Something went wrong...'}
      </p>
    </div>
  );
}

Error.propTypes = {
  error: PropTypes.object,
};

export default Error;
