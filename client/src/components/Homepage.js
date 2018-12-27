import React from 'react';
import PropTypes from 'prop-types';
import Landing from './Landing';
import { withUserContext } from '../UserContext';

function Homepage({ isAuthenticated }) {
  if (!isAuthenticated) {
    return <Landing />;
  }

  return (
    <div className="container">
      <h1>Homepage for authenticated users</h1>
    </div>
  );
}

Homepage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

export default withUserContext(Homepage);
