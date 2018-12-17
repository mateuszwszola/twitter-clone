import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SignIn from '../components/SignIn';
import loginUser from '../functions/loginUser';

class SignInContainer extends Component {
  state = {
    username: '',
    password: '',
    errors: {}
  };

  componentDidMount() {
    const { isAuthenticated, history } = this.props;
    if (isAuthenticated) {
      history.push('/');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated === true) {
      this.props.history.push('/');
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
    if (!username || !password) {
      return;
    }

    const userData = {
      username,
      password
    };

    console.log('The form has been submitted!');
    loginUser(userData, this.props.auth, this.handleErrors);
  };

  render() {
    const { username, password } = this.state;

    return (
      <SignIn
        username={username}
        password={password}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

SignInContainer.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.func.isRequired
};

export default SignInContainer;
