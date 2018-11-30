import React, { Component } from 'react';
// import PropTypes from 'prop-types';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.login || !this.state.password) {
      return;
    }
    console.log('The form has been submitted!');
  }

  render() {
    const { login, password } = this.state;

    return (
      <div className="container">
        <h2>SignIn</h2>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="login">Login</label>
          <input
            type="text"
            id="login"
            name="login"
            value={login}
            onChange={this.handleChange}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={this.handleChange}
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default SignIn;
