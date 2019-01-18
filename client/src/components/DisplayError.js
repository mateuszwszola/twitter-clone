import React from 'react';
import styled from 'styled-components';

const ErrorWrapper = styled.div`
  margin: 15px auto;
  text-align: center;
`;

const ErrorMsg = styled.p`
  color: red,
  font-weight: bold,
  font-size: 1.5rem;
`;

export default function DisplayError(error) {
  return (
    <ErrorWrapper>
      <ErrorMsg>{JSON.stringify(error)}</ErrorMsg>
    </ErrorWrapper>
  );
}
