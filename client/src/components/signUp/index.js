import React from 'react';
import PropTypes from 'prop-types';
import InputGroup from 'components/InputGroup';
import { Button } from 'shared/components';
import { Container } from 'shared/layout';
import {
  SignUpContainer,
  Title,
  Form,
  Helper,
  StyledLink,
  ErrorMessage,
} from './style';

function SignUp({
  name,
  username,
  email,
  password,
  password2,
  onSubmit,
  errors,
}) {
  return (
    <Container>
      <SignUpContainer>
        <Title data-cy="signup-title">Sign Up</Title>
        {errors.message && <ErrorMessage>{errors.message}</ErrorMessage>}
        <Form onSubmit={onSubmit} data-cy="signup-form">
          <InputGroup
            data-cy="signup-name-input"
            type="text"
            name="name"
            {...name}
            placeholder="Name"
            autocomplete="name"
            error={!!(errors?.name || errors.message)}
            errorMsg={errors?.name}
          />
          <InputGroup
            data-cy="signup-username-input"
            type="text"
            name="username"
            {...username}
            placeholder="Username"
            autocomplete="username"
            error={!!(errors?.username || errors.message)}
            errorMsg={errors?.username}
          />
          <InputGroup
            data-cy="signup-email-input"
            type="email"
            name="email"
            {...email}
            placeholder="Email"
            autocomplete="new-password"
            error={!!(errors?.email || errors.message)}
            errorMsg={errors?.email}
          />
          <InputGroup
            data-cy="signup-password-input"
            type="password"
            name="password"
            {...password}
            placeholder="Password"
            error={!!(errors?.password || errors.message)}
            errorMsg={errors?.password}
          />
          <InputGroup
            data-cy="signup-password2-input"
            type="password"
            name="password2"
            {...password2}
            placeholder="Confirmation password"
            error={!!(errors?.password2 || errors.message)}
            errorMsg={errors?.password2}
          />
          <Button data-cy="signup-submit" primary type="submit">
            Sign Up
          </Button>
        </Form>
        <Helper>
          Already have an account?
          <StyledLink to="/signin">
            Sign In now <i className="fas fa-angle-double-right" />
          </StyledLink>
        </Helper>
      </SignUpContainer>
    </Container>
  );
}

SignUp.propTypes = {
  name: PropTypes.object.isRequired,
  username: PropTypes.object.isRequired,
  email: PropTypes.object.isRequired,
  password: PropTypes.object.isRequired,
  password2: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default SignUp;
