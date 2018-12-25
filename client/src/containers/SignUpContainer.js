import React, { Component } from 'react';
import SignUp from '../components/SignUp';
import registerUser from '../functions/registerUser';

import PropTypes from 'prop-types';

class SignUpContainer extends Component {
  state = {
    name: '',
    email: '',
    username: '',
    password: '',
    password2: '',
    errors: {},
    successRegister: false
  };

  componentDidMount() {
    if (this.props.isAuthenticated === true) {
      this.props.history.push('/');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated === true) {
      this.setState({ successRegister: true });
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
    this.props.history.push('/signin');
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
      successRegister
    } = this.state;
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
        successRegister={successRegister}
      />
    );
  }
}

SignUpContainer.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.func.isRequired
};

export default SignUpContainer;
