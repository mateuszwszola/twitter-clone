import React from 'react';
import PropTypes from 'prop-types';
import { Wrapper, Message } from './style';

export default function DisplayErrors({ errors }) {
  return (
    <Wrapper>
      {errors.map(error => (
        <Message key={error.msg}>{error.msg}</Message>
      ))}
    </Wrapper>
  );
}

DisplayErrors.propTypes = {
  errors: PropTypes.array
};

DisplayErrors.defaultProps = {
  errors: [{ msg: 'Something went wrong...' }]
};
