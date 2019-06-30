import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import SignIn from '../components/signIn';
import validateForm from '../utils/validateForm';
import isEmpty from '../utils/isEmpty';

class SignInContainer extends Component {
  state = {
    username: '',
    password: '',
    errors: {},
    redirect: false
  };

  componentWillUnmount() {
    this.props.clearErrors();
  }

  static getDerivedStateFromProps(props, state) {
    const { auth, errors } = props;
    if (auth.isAuthenticated || !isEmpty(errors)) {
      return {
        ...state,
        redirect: auth.isAuthenticated,
        errors: !isEmpty(props.errors) && props.errors
      };
    }

    return null;
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState(() => ({
      [name]: value
    }));
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

    const errors = validateForm(userData);
    if (errors) {
      return this.handleErrors(errors);
    }

    this.props.loginUser(userData);
  };

  render() {
    const { username, password, errors, redirect } = this.state;
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    if (redirect) {
      return <Redirect to={from} />;
    }

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
  loginUser: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = ({ auth, errors }) => ({
  auth,
  errors
});

export default connect(
  mapStateToProps,
  { loginUser, clearErrors }
)(SignInContainer);
