import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import SignIn from '../components/SignIn';
import { loginUser } from '../utils/api';
import isEmpty from '../utils/isEmpty';
import { UserContext } from '../UserContext';

class SignInContainer extends Component {
  static contextType = UserContext;
  state = {
    username: '',
    password: '',
    errors: {}
  };

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
    loginUser(userData, this.context.authenticateUser, this.handleErrors);
  };

  render() {
    const { username, password, errors } = this.state;
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    if (this.context.isAuthenticated === true) {
      return <Redirect to="/" />;
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

export default SignInContainer;
