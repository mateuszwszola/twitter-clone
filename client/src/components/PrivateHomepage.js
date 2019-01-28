import React from 'react';
import PropTypes from 'prop-types';
import Landing from './Landing';
import HomepageContainer from '../containers/HomepageContainer';
import { withUserContext } from '../UserContext';

function PrivateHomepage({ isAuthenticated }) {
  if (!isAuthenticated) {
    return <Landing />;
  }

  return <HomepageContainer />;
}

PrivateHomepage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

export default withUserContext(PrivateHomepage);
