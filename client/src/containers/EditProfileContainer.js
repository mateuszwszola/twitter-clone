import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUserProfile, updateProfile } from 'actions/profileActions';
import Loading from 'components/Loading';
import EditProfile from 'components/EditProfile';
import useDynamicFormInput from 'hooks/useDynamicFormInput';

function EditProfileContainer({
  history,
  errors,
  profile: { profile, loading },
  getUserProfile,
  updateProfile
}) {

  const name = useDynamicFormInput((profile && profile.user && profile.user.name) || '');
  const username = useDynamicFormInput((profile && profile.user && profile.user.username) || '');
  const bio = useDynamicFormInput((profile && profile.bio) || '');
  const location = useDynamicFormInput((profile && profile.location) || '');
  const website = useDynamicFormInput((profile && profile.website) || '');
  const birthday = useDynamicFormInput((profile && profile.birthday) || '');
  const avatar = useDynamicFormInput((profile && profile.user.avatar) || '');
  const backgroundPicture = useDynamicFormInput((profile && profile.backgroundPicture) || '');

  useEffect(() => {
      getUserProfile();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const profileData = {
      name: name.value || '',
      username: username.value || '',
      bio: bio.value || '',
      website: website.value || '',
      location: location.value || '',
      birthday: birthday.value || '',
      avatar: avatar.value || '',
      backgroundPicture: backgroundPicture.value || ''
    };

    updateProfile(profileData, history);
  }

  if (loading || profile === null) {
    return <Loading />;
  }

  return (
    <EditProfile
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
  );
}

EditProfileContainer.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.array.isRequired,
  getUserProfile: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getUserProfile, updateProfile }
)(EditProfileContainer);
