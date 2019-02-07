import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Landing from './Landing';
import HomepageContainer from '../containers/HomepageContainer';

function PrivateHomepage({ isAuthenticated }) {
  if (!isAuthenticated) {
    return <Landing />;
  }

  return <HomepageContainer />;
}

PrivateHomepage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = ({ auth }) => ({
  isAuthenticated: auth.isAuthenticated
});

export default connect(mapStateToProps)(PrivateHomepage);
