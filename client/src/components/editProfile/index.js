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
        handleSubmit={handleSubmit}
        errors={errors}
        history={history}
      />
    </Container>
  );
}

EditProfile.propTypes = {
  name: PropTypes.object.isRequired,
  username: PropTypes.object.isRequired,
  bio: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  website: PropTypes.object.isRequired,
  birthday: PropTypes.object.isRequired,
  avatar: PropTypes.object.isRequired,
  backgroundPicture: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired
};

export default EditProfile;
