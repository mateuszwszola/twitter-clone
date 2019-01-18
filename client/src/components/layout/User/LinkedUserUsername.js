import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const LinkedUserUsername = ({ username }) => (
  <p className="user-info-username">
    @
    <Link to={`/${username}`} className="user-info-link">
      {username}
    </Link>
  </p>
);

LinkedUserUsername.propTypes = {
  username: PropTypes.string.isRequired
};

export default LinkedUserUsername;
