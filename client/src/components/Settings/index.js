import InputGroup from 'components/InputGroup';
import React from 'react';
import { ChangePasswordButton, Form } from './style';

export function ChangePasswordForm({
  handlePasswordFormSubmit,
  password,
  password2,
}) {
  return (
    <Form onSubmit={handlePasswordFormSubmit}>
      <label>
        Current password:
        <InputGroup
          type="password"
          name="password"
          {...password}
          placeholder="Password"
          error={false}
          errorMsg=""
        />
      </label>
      <label>
        New password:
        <InputGroup
          type="password"
          name="password2"
          {...password2}
          placeholder="Repeat password"
          error={false}
          errorMsg={''}
        />
      </label>
      <ChangePasswordButton primary type="submit">
        Change password
      </ChangePasswordButton>
    </Form>
  );
}
