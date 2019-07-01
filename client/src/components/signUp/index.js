import React from 'react';
import PropTypes from 'prop-types';
import InputGroup from 'components/InputGroup';
import { Button } from 'shared/components';
import { Container } from 'shared/layout';
import { SignUpContainer, Title, Form, Helper, StyledLink } from './style';

function SignUp({
  name,
  username,
  email,
  password,
  password2,
  onChange,
  onSubmit,
  errors
}) {
  return (
    <Container>
      <SignUpContainer>
        <Title>Sign Up to Twitter</Title>
        <Form onSubmit={onSubmit}>
          <InputGroup
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            placeholder="Name"
            autocomplete="name"
            error={!!errors.name}
            errorMsg={errors.name ? errors.name : null}
          />
          <InputGroup
            type="text"
            name="username"
            value={username}
            onChange={onChange}
            placeholder="Username"
            autocomplete="username"
            error={!!errors.username}
            errorMsg={errors.username ? errors.username : null}
          />
          <InputGroup
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Email"
            autocomplete="new-password"
            error={!!errors.email}
            errorMsg={errors.email ? errors.email : null}
          />
          <InputGroup
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Password"
            error={!!errors.password}
            errorMsg={errors.password ? errors.password : null}
          />
          <InputGroup
            type="password"
            name="password2"
            value={password2}
            onChange={onChange}
            placeholder="Repeat password"
            error={!!errors.password2}
            errorMsg={errors.password2 ? errors.password2 : null}
          />
          <Button primary type="submit">
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
  name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  password2: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

export default SignUp;
