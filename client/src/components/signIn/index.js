import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import InputGroup from 'components/InputGroup';
import { Button } from 'shared/components';
import { Container } from 'shared/layout';
import { SignInContainer, Title, Form, Helper, ErrorMessage } from './style';

function SignIn({ username, password, onSubmit, errors }) {
  return (
    <Container>
      <SignInContainer>
        <Title>Sign In</Title>
        {errors.message && <ErrorMessage>{errors.message}</ErrorMessage>}
        <Form onSubmit={onSubmit} data-cy="signin-form">
          <InputGroup
            data-cy="signin-username-input"
            type="text"
            name="username"
            {...username}
            placeholder="Email or username"
            autocomplete="username"
            error={!!(errors?.username || errors.message)}
            errorMsg={errors?.username}
          />
          <InputGroup
            data-cy="signin-password-input"
            type="password"
            name="password"
            {...password}
            placeholder="Password"
            autocomplete="current-password"
            error={!!(errors?.password || errors.message)}
            errorMsg={errors?.password}
          />
          <Button type="submit" primary>
            Log In
          </Button>
        </Form>
        <Helper>
          New?
          <Link to="/signup" className="login-signup-link">
            Sign up now <i className="fas fa-angle-double-right" />
          </Link>
        </Helper>
      </SignInContainer>
    </Container>
  );
}

SignIn.propTypes = {
  username: PropTypes.object.isRequired,
  password: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default SignIn;
