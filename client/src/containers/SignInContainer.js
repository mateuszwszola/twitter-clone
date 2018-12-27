import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import SignIn from '../components/SignIn';
import loginUser from '../functions/loginUser';
import isEmpty from '../utils/isEmpty';

class SignInContainer extends Component {
  state = {
    username: '',
    password: '',
    errors: {},
    redirectToRefferer: false
  };

  componentDidMount() {
    if (this.props.isAuthenticated === true) {
      this.setState(() => ({
        redirectToRefferer: true
      }));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated === true) {
      this.setState(() => ({
        redirectToRefferer: true
      }));
    }
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  handleErrors = errors => {
    this.setState(() => ({ errors }));
  };

  handleSubmit = e => {
    e.preventDefault();
    const { username, password } = this.state;
    const userData = {
      username,
      password
    };

    const fields = Object.keys(userData);
    const errors = {};
    for (const field of fields) {
      if (!userData[field].trim()) {
        errors[field] = `${field} field is required`;
      }
    }
    if (!isEmpty(errors)) {
      this.handleErrors(errors);
      return;
    }
    loginUser(userData, this.props.auth, this.handleErrors);
  };

  render() {
    const { username, password, errors, redirectToRefferer } = this.state;
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    if (redirectToRefferer === true) {
      return <Redirect to={from} />;
    }
    return (
      <SignIn
        username={username}
        password={password}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        errors={errors}
        registered={
          (this.props.location.state && this.props.location.state.info) || false
        }
      />
    );
  }
}

SignInContainer.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  auth: PropTypes.func.isRequired
};

export default SignInContainer;
