import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { logoutUser } from '../utils/api';
import { withUserContext } from '../UserContext';

class SignOut extends Component {
  componentDidMount() {
    logoutUser(this.props.authenticateUser);
  }
}

SignOut.propTypes = {
  authenticateUser: PropTypes.func.isRequired
};

export default withUserContext(SignOut);
