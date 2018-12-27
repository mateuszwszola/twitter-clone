import React from 'react';
import PropTypes from 'prop-types';

function Profile({ profile, error }) {
  console.log(profile);
  if (error) {
    return <p className="invalid-feedback">{error}</p>;
  }
  return (
    <div>
      <p>Name: {profile.user.name}</p>
      <p>Username: {profile.user.username}</p>
    </div>
  );
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired
};

export default Profile;
