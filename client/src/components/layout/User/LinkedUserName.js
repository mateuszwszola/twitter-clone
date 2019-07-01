import React from 'react';
import PropTypes from 'prop-types';
import { StyledUserName, UserInfoLink } from './style';

const LinkedUserName = ({ username, name }) => (
  <StyledUserName>
    <UserInfoLink to={`/${username}`}>{name}</UserInfoLink>
  </StyledUserName>
);

LinkedUserName.propTypes = {
  username: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default LinkedUserName;
