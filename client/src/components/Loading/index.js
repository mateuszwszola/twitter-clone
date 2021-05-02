import React from 'react';
import { Spinner, Wrapper } from './style';

function Loading() {
  return (
    <Wrapper>
      <Spinner>
        <div />
        <div />
        <div />
      </Spinner>
    </Wrapper>
  );
}

export default Loading;
