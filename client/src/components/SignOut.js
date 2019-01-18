import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { logoutUser } from '../utils/api';
import Loading from './Loading';
import { withUserContext } from '../UserContext';

class SignOut extends Component {
  state = {
    redirect: false
  };

  componentDidMount() {
    logoutUser(this.props.authenticateUser);
    this.setState(() => ({
      redirect: true
    }));
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    } else {
      return <Loading />;
    }
  }
}

SignOut.propTypes = {
  authenticateUser: PropTypes.func.isRequired
};

export default withUserContext(SignOut);
