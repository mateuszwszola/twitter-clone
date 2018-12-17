import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logoutUser from '../functions/logoutUser';

import { Link } from 'react-router-dom';

class SignOut extends Component {
  render() {
    return (
      <button onClick={() => logoutUser(this.props.auth)}>Sign Out</button>
    );
  }
}

SignOut.propTypes = {
  auth: PropTypes.func.isRequired
};

export default SignOut;
