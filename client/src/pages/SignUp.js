import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import SignUp from 'components/SignUp';
import isEmpty from 'utils/isEmpty';
import useFormInput from 'hooks/useFormInput';
import { useAuth } from 'context/AuthContext';

function SignUpContainer() {
  const name = useFormInput('');
  const email = useFormInput('');
  const username = useFormInput('');
  const password = useFormInput('');
  const password2 = useFormInput('');
  const [errors, setErrors] = useState({});
  const [redirect, setRedirect] = useState(false);
  const { isAuthenticated, register } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setRedirect(isAuthenticated);
    }
  }, [isAuthenticated]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      name: name.value,
      email: email.value,
      username: username.value,
      password: password.value,
    };

    const errors = validateForm({ ...newUser, password2: password2.value });

    if (errors) {
      setErrors(errors);
    } else {
      register(newUser).catch((err) => {
        setErrors({ message: err.response.data.message });
      });
    }
  };

  if (redirect) {
    return <Redirect to="/" />;
  }

  return (
    <SignUp
      name={name}
      email={email}
      username={username}
      password={password}
      password2={password2}
      onSubmit={handleSubmit}
      errors={errors}
    />
  );
}

function validateForm(data) {
  const errors = {};
  for (const field of Object.keys(data)) {
    if (!data[field].trim()) {
      errors[field] = `${
        field === 'password2' ? 'confirmation password' : field
      } is required`;
    } else if (data.password !== data.password2) {
      errors.password = 'password must match';
      errors.password2 = 'password must match';
    }
  }

  return isEmpty(errors) ? null : errors;
}

export default SignUpContainer;
