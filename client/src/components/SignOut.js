import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logoutUser from '../functions/logoutUser';

import { Link } from 'react-router-dom';

class SignOut extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Link onClick={() => logoutUser(this.props.auth)}>Sign Out</Link>;
  }
}

SignOut.propTypes = {
  auth: PropTypes.func.isRequired
};

export default SignOut;
