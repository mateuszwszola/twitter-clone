import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Landing from '../landing';
import HomepageContainer from 'containers/HomepageContainer';

const PrivateHomepage = ({ isAuthenticated }, ...rest) =>
  isAuthenticated ? <HomepageContainer {...rest} /> : <Landing {...rest} />;

PrivateHomepage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = ({ auth }) => ({
  isAuthenticated: auth.isAuthenticated
});

export default connect(mapStateToProps)(PrivateHomepage);
