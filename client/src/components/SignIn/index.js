import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import InputGroup from '../UI/InputGroup';
import PrimaryButton from '../UI/Buttons/PrimaryButton';

function SignIn({ login, password, onChange, onSubmit }) {
  return (
    <div className="container">
      <div className="auth__container">
        <h1 className="auth__logo">Sign in to Twitter</h1>
        <form className="auth__form" onSubmit={onSubmit}>
          <InputGroup
            type="text"
            name="login"
            value={login}
            onChange={onChange}
            placeholder="Email or username"
          />
          <InputGroup
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Password"
          />
          <PrimaryButton type="submit" text="Log in" />
        </form>
        <p className="signup-helper">
          New to Twitter?
          <Link to="/signup" className="login-signup-link">
            Sign up now <i className="fas fa-angle-double-right" />
          </Link>
        </p>
      </div>
    </div>
  );
}

SignIn.propTypes = {
  login: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default SignIn;
