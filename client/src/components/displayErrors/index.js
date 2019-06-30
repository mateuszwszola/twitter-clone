import React from 'react';
import PropTypes from 'prop-types';
import { Wrapper, Message } from './style';

export default function DisplayErrors({ error }) {
  return (
    <Wrapper>
      <Message>{error}</Message>
    </Wrapper>
  );
}

DisplayErrors.propTypes = {
  error: PropTypes.string
};

DisplayErrors.defaultProps = {
  error: 'Something went wrong...'
};
