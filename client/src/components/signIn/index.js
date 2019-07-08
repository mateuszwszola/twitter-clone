import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import InputGroup from 'components/InputGroup';
import { Button, FeedbackMessage } from 'shared/components';
import { Container } from 'shared/layout';
import { SignInContainer, Title, Form, Helper } from './style';

const SignIn = ({ username, password, onChange, onSubmit, errors }) => (
  <Container>
    <SignInContainer>
      <Title>Sign in to Twitter</Title>
      <Form onSubmit={onSubmit} data-cy="signin-form">
        <InputGroup
          data-cy="signin-username-input"
          type="text"
          name="username"
          value={username}
          onChange={onChange}
          placeholder="Email or username"
          autocomplete="username"
          error={!!(errors.login || errors.username)}
          errorMsg={errors.username || errors.login || null}
        />
        <InputGroup
          data-cy="signin-password-input"
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password"
          autocomplete="current-password"
          error={!!(errors.login || errors.password)}
          errorMsg={errors.password || null}
        />
        {errors.login ? (
          <FeedbackMessage>{errors.login}</FeedbackMessage>
        ) : null}
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
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

export default SignIn;
