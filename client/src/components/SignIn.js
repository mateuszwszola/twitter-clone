import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import InputGroup from './UI/InputGroup';
import { Button } from './UI/Button';

function SignIn({ username, password, onChange, onSubmit, errors }) {
  return (
    <div className="container">
      <div className="auth__container">
        <h1 className="auth__logo">Sign in to Twitter</h1>
        <form className="auth__form" onSubmit={onSubmit}>
          <InputGroup
            type="text"
            name="username"
            value={username}
            onChange={onChange}
            placeholder="Email or username"
            error={errors.login || errors.username ? true : false}
            errorMsg={errors.username || errors.login || null}
          />
          <InputGroup
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Password"
            error={errors.login || errors.password ? true : false}
            errorMsg={errors.password || null}
          />
          {errors.login ? (
            <div className="invalid-feedback">{errors.login}</div>
          ) : null}
          <Button type="submit" primary>
            Log In
          </Button>
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
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

export default SignIn;
