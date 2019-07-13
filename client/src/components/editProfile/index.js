import React from 'react';
import PropTypes from 'prop-types';
import Form from './Form';
import { Container } from 'shared/layout';

function EditProfile({
  name,
  username,
  bio,
  location,
  website,
  birthday,
  avatar,
  backgroundPicture,
  handleChange,
  handleSubmit,
  errors,
  history
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
        avatar={avatar}
        backgroundPicture={backgroundPicture}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        errors={errors}
        history={history}
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
  avatar: PropTypes.string.isRequired,
  backgroundPicture: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default EditProfile;
