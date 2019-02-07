import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../actions/authActions';
import SignUp from '../components/SignUp';
import validateForm from '../utils/validateForm';
import isEmpty from '../utils/isEmpty';

class SignUpContainer extends Component {
  state = {
    name: '',
    email: '',
    username: '',
    password: '',
    password2: '',
    errors: {}
  };

  componentWillReceiveProps({ errors }) {
    if (errors) {
      this.handleErrors(errors);
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
    const { name, email, username, password, password2 } = this.state;

    const newUser = {
      name,
      email,
      username,
      password,
      password2
    };

    const errors = validateForm(newUser);
    if (!isEmpty(errors)) {
      return this.handleErrors(errors);
    }

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { name, email, username, password, password2, errors } = this.state;

    if (this.props.auth.isAuthenticated) {
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

SignUpContainer.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = ({ auth, errors }) => ({
  auth,
  errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(SignUpContainer));
