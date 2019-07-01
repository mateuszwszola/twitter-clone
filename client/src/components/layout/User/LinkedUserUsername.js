import React from 'react';
import PropTypes from 'prop-types';
import { StyledUserUsername, UserInfoLink } from './style';

const LinkedUserUsername = ({ username }) => (
  <StyledUserUsername>
    @<UserInfoLink to={`/${username}`}>{username}</UserInfoLink>
  </StyledUserUsername>
);

LinkedUserUsername.propTypes = {
  username: PropTypes.string.isRequired
};

export default LinkedUserUsername;
