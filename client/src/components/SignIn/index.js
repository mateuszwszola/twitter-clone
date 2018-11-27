import React, { Component } from 'react';
// import PropTypes from 'prop-types';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'SignIn component'
    };
  }

  render() {
    return (
      <div className="container">
        <h2>SignIn</h2>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default SignIn;
