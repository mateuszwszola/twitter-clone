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
  onSubmit,
  errors
}) {

  const findIfErrExists = (param) => {
    const error = errors.find(err => err.param === param);
    if (error) {
      return error.msg;
    } else {
      return error;
    }
  };

  return (
    <Container>
      <SignUpContainer>
        <Title>Sign Up to Twitter</Title>
        <Form onSubmit={onSubmit}>
          <InputGroup
            type="text"
            name="name"
            {...name}
            placeholder="Name"
            autocomplete="name"
            error={!!(findIfErrExists('name'))}
            errorMsg={findIfErrExists('name')}
          />
          <InputGroup
            type="text"
            name="username"
            {...username}
            placeholder="Username"
            autocomplete="username"
            error={!!(findIfErrExists('username'))}
            errorMsg={findIfErrExists('username')}
          />
          <InputGroup
            type="email"
            name="email"
            {...email}
            placeholder="Email"
            autocomplete="new-password"
            error={!!(findIfErrExists('email'))}
            errorMsg={findIfErrExists('email')}
          />
          <InputGroup
            type="password"
            name="password"
            {...password}
            placeholder="Password"
            error={!!(findIfErrExists('password'))}
            errorMsg={findIfErrExists('password')}
          />
          <InputGroup
            type="password"
            name="password2"
            {...password2}
            placeholder="Repeat password"
            error={!!(findIfErrExists('password2'))}
            errorMsg={findIfErrExists('password2')}
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
  name: PropTypes.object.isRequired,
  username: PropTypes.object.isRequired,
  email: PropTypes.object.isRequired,
  password: PropTypes.object.isRequired,
  password2: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired
};

export default SignUp;
