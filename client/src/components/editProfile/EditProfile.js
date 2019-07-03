import React from 'react';
import PropTypes from 'prop-types';
import Form from './form/Form';
import { Container } from 'shared/layout';

function EditProfile({
  name,
  username,
  bio,
  location,
  website,
  birthday,
  handleChange,
  handleSubmit,
    errors
}) {
  return (
    <Container>
      <Form
        name={name}
        username={username}
        bio={bio}
        location={location}
        website={website}
        birthday={birthday}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        errors={errors}
      />
    </Container>
  );
}

EditProfile.propTypes = {
  name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  website: PropTypes.string.isRequired,
  birthday: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

export default EditProfile;
