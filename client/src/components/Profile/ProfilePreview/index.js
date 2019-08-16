import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container } from './style';

function ProfilePreview({ profile }) {
  return (
    <Container>
      <Link to={`/${profile.user.username}`}>
        <h3>{profile.user.name}</h3>
        <p>@{profile.user.username}</p>
      </Link>
    </Container>
  );
}

ProfilePreview.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfilePreview;
