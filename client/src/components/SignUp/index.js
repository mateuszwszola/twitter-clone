import React, { Component } from 'react';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Sign up'
    };
  }

  render() {
    return (
      <div className="container">
        <h2>Sign Up</h2>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default SignUp;
