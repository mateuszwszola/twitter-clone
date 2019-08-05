import React from 'react';
import PropTypes from 'prop-types';
import { Wrapper, Message } from './style';

export default function DisplayErrors({ errors }) {
  return (
    <Wrapper>
      <Message>{errors.message ? errors.message : errors}</Message>
    </Wrapper>
  );
}

DisplayErrors.propTypes = {
  error: PropTypes.string
};

DisplayErrors.defaultProps = {
  error: 'Something went wrong...'
};
