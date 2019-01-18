import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const LinkedUserName = ({ username, name }) => (
  <h1 className="user-info-name">
    <Link to={`/${username}`} className="user-info-link">
      {name}
    </Link>
  </h1>
);

LinkedUserName.propTypes = {
  username: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default LinkedUserName;
