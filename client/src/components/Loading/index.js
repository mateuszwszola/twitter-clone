import React from 'react';
import { Spinner, Wrapper } from './style';
import PropTypes from 'prop-types';

function Loading({ isSmall, isFixed }) {
  return (
    <Wrapper isFixed={isFixed}>
      <Spinner isSmall={isSmall}>
        <div />
        <div />
        <div />
      </Spinner>
    </Wrapper>
  );
}

Loading.defaultProps = {
  isSmall: false,
  isFixed: true,
};

Loading.propTypes = {
  isSmall: PropTypes.bool,
  isFixed: PropTypes.bool,
};

export default Loading;
