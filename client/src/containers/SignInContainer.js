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
    if (isAuthenticated === true) {
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
    const userData = {
      username,
      password
    };

    loginUser(userData, this.props.auth, this.handleErrors);
  };

  render() {
    const { username, password, errors } = this.state;

    return (
      <SignIn
        username={username}
        password={password}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        errors={errors}
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
