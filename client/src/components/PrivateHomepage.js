import React from 'react';
import PropTypes from 'prop-types';
import Landing from './Landing';
// import HomepageContainer from '../containers/HomepageContainer';
import Homepage from './Homepage';
import { withUserContext } from '../UserContext';

import { profileData } from './Profile/dummydata';

function PrivateHomepage({ isAuthenticated }) {
  if (!isAuthenticated) {
    return <Landing />;
  }

  return <Homepage profile={profileData} />;
}

PrivateHomepage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

export default withUserContext(PrivateHomepage);
