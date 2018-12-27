import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import SignUp from '../components/SignUp';
import { registerUser } from '../utils/api';
import isEmpty from '../utils/isEmpty';
import { UserContext } from '../UserContext';

class SignUpContainer extends Component {
  static contextType = UserContext;
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
    if (this.context.isAuthenticated === true) {
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
    if (this.context.isAuthenticated === true) {
      return <Redirect to="/" />;
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

export default SignUpContainer;
