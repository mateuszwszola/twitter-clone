import React from 'react';
import PropTypes from 'prop-types';

function Profile({ profile, fetchError }) {
  console.log(profile);
  if (fetchError) {
    return <p className="invalid-feedback">{fetchError}</p>;
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
