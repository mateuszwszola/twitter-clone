import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import SignUp from '../components/SignUp';
import registerUser from '../functions/registerUser';
import isEmpty from '../utils/isEmpty';

class SignUpContainer extends Component {
  state = {
    name: '',
    email: '',
    username: '',
    password: '',
    password2: '',
    errors: {},
    redirect: false,
    redirectPath: '/',
    successRegister: false
  };

  componentDidMount() {
    console.log('Comp did mount');
    if (this.props.isAuthenticated === true) {
      this.setState(() => ({
        redirect: true,
        redirectPath: '/'
      }));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated === true) {
      this.setState(() => ({
        redirect: true,
        redirectPath: '/'
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

  handleRegister = () => {
    this.setState(() => ({
      redirect: true,
      redirectPath: '/signin',
      successRegister: true
    }));
  };

  handleSubmit = e => {
    e.preventDefault();
    const { name, email, username, password, password2 } = this.state;

    const newUser = {
      name,
      email,
      username,
      password,
      password2
    };

    // Front end validation - check if field is not empty
    const fields = Object.keys(newUser);
    const errors = {};
    for (const field of fields) {
      if (!newUser[field].trim()) {
        errors[field] = `${field} field is required`;
      }
    }
    if (!isEmpty(errors)) {
      this.handleErrors(errors);
      return;
    }

    registerUser(newUser, this.handleRegister, this.handleErrors);
  };

  render() {
    const {
      name,
      email,
      username,
      password,
      password2,
      errors,
      redirect,
      redirectPath,
      successRegister
    } = this.state;
    if (redirect === true) {
      return (
        <Redirect
          to={{
            pathname: redirectPath,
            state: { info: successRegister }
          }}
        />
      );
    }
    return (
      <SignUp
        name={name}
        email={email}
        username={username}
        password={password}
        password2={password2}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        errors={errors}
      />
    );
  }
}

SignUpContainer.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

export default SignUpContainer;
