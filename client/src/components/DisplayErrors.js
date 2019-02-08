import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ErrorWrapper = styled.div`
  margin: 30px auto;
  text-align: center;
`;

const ErrorMsg = styled.p`
  color: red;
  font-weight: bold;
  font-size: 1.5rem;
`;

export default function DisplayErrors({ error }) {
  return (
    <ErrorWrapper>
      <ErrorMsg>{error}</ErrorMsg>
    </ErrorWrapper>
  );
}

DisplayErrors.propTypes = {
  error: PropTypes.string.isRequired
};
