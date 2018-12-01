import React, { Component } from 'react';
import SignIn from '../components/SignIn';

class SignInContainer extends Component {
  state = {
    login: '',
    password: ''
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (!this.state.login || !this.state.password) {
      return;
    }
    console.log('The form has been submitted!');
  };

  render() {
    const { login, password } = this.state;

    return (
      <SignIn
        login={login}
        password={password}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default SignInContainer;
