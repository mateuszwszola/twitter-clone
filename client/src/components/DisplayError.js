import React from 'react';
import PropTypes from 'prop-types';
import 'styled-components/macro';

function Error({ error }) {
  if (!error) {
    return null;
  }

  const errorMessage =
    error.response?.data?.message ||
    error.message ||
    'Something went wrong. Sorry...';

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
        {errorMessage}
      </p>
    </div>
  );
}

Error.propTypes = {
  error: PropTypes.object,
};

export default Error;
