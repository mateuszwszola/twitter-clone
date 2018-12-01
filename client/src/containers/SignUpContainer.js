import React, { Component } from 'react';
import SignUp from '../components/SignUp';

class SignUpContainer extends Component {
  state = {
    name: '',
    email: '',
    username: '',
    password: '',
    password2: ''
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { name, email, username, password, password2 } = this.state;
    if (!name || !email || !username || !password || !password2) {
      return;
    }

    console.log('The form has been submitted!');
  };

  render() {
    const { name, email, username, password, password2 } = this.state;

    return (
      <SignUp
        name={name}
        email={email}
        username={username}
        password={password}
        password2={password2}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default SignUpContainer;
