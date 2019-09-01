import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import InputGroup from 'components/InputGroup';
import { Button } from 'shared/components';
import { Container } from 'shared/layout';
import { SignInContainer, Title, Form, Helper } from './style';

const SignIn = ({ username, password, onSubmit, errors }) => (
  <Container>
    <SignInContainer>
      <Title>Sign in to Twitter</Title>
      <Form onSubmit={onSubmit} data-cy="signin-form">
        <InputGroup
          data-cy="signin-username-input"
          type="text"
          name="username"
          {...username}
          placeholder="Email or username"
          autocomplete="username"
          error={errors.length > 0}
          errorMsg={errors[0] && errors[0].msg || null}
        />
        <InputGroup
          data-cy="signin-password-input"
          type="password"
          name="password"
          {...password}
          placeholder="Password"
          autocomplete="current-password"
          error={errors.length > 0}
          errorMsg={errors[0] && errors[0].msg || null}
        />
        <Button type="submit" primary>
          Log In
        </Button>
      </Form>
      <Helper>
        New to Twitter?
        <Link to="/signup" className="login-signup-link">
          Sign up now <i className="fas fa-angle-double-right" />
        </Link>
      </Helper>
    </SignInContainer>
  </Container>
);

SignIn.propTypes = {
  username: PropTypes.object.isRequired,
  password: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired
};

export default SignIn;
