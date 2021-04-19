import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfile, updateProfile } from 'actions/profileActions';
import Loading from 'components/Loading';
import EditProfile from 'components/EditProfile';
import useDynamicFormInput from 'hooks/useDynamicFormInput';
import isEmpty from 'utils/isEmpty';
import moment from 'moment';

function EditProfileContainer({
  history,
  errors,
  profile: { profile },
  getUserProfile,
  updateProfile,
}) {
  const name = useDynamicFormInput(
    (profile && profile.user && profile.user.name) || ''
  );
  const username = useDynamicFormInput(
    (profile && profile.user && profile.user.username) || ''
  );
  const bio = useDynamicFormInput((profile && profile.bio) || '');
  const location = useDynamicFormInput((profile && profile.location) || '');
  const website = useDynamicFormInput((profile && profile.website) || '');
  const birthday = useDynamicFormInput((profile && profile.birthday) || '');
  const avatar = useDynamicFormInput((profile && profile.user.avatar) || '');
  const backgroundPicture = useDynamicFormInput(
    (profile && profile.backgroundPicture) || ''
  );

  const state = {
    name,
    username,
    bio,
    location,
    website,
    birthday,
    avatar,
    backgroundPicture,
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const profileData = {};
    const userFields = ['name', 'username', 'avatar'];
    const profileFields = [
      'bio',
      'website',
      'location',
      'birthday',
      'backgroundPicture',
    ];
    userFields.forEach((field) => {
      if (
        profile.user &&
        (!profile.user[field] ||
          (profile.user[field] && state[field].value) !== profile.user[field])
      ) {
        profileData[field] = state[field].value;
      }
    });
    profileFields.forEach((field) => {
      if (state[field].value !== profile[field]) {
        if (field === 'birthday') {
          if (birthday.value) {
            profileData.birthday = moment(birthday.value).format('YYYY-MM-DD');
          }
        } else {
          profileData[field] = state[field].value;
        }
      }
    });
    if (!isEmpty(profileData)) {
      updateProfile(profileData, history);
    }
  }

  if (profile === null) {
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
  updateProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getUserProfile: getProfile,
  updateProfile,
})(EditProfileContainer);
