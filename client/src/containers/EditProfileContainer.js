import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUserProfile, updateProfile } from 'actions/profileActions';
import Loading from 'components/Loading';
import EditProfile from 'components/EditProfile';

function reducer(state, newState) {
  return { ...state, ...newState };
}

function EditProfileContainer({
  history,
  errors,
  profile: { profile, loading },
  getUserProfile,
  updateProfile
}) {
  const [state, setState] = useReducer(reducer, {
    name: '',
    username: '',
    bio: '',
    location: '',
    website: '',
    birthday: '',
    avatar: '',
    backgroundPicture: ''
  });

  const {
    name,
    username,
    bio,
    location,
    website,
    birthday,
    avatar,
    backgroundPicture
  } = state;

  useEffect(() => {
    if (profile === null && loading === false) {
      getUserProfile();
    }
  }, []);

  useEffect(() => {
    if (profile === null) {
      return;
    }
    setState({
      name: profile.user.name || '',
      username: profile.user.username || '',
      bio: profile.bio || '',
      location: profile.location || '',
      website: profile.website || '',
      birthday: profile.birthday || '',
      avatar: profile.user.avatar || '',
      backgroundPicture: profile.backgroundPicture || ''
    });
  }, [profile]);

  function handleChange(e) {
    const { name, value } = e.target;
    setState({ [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const profileData = {
      name,
      username,
      bio,
      website,
      location,
      birthday,
      avatar,
      backgroundPicture
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
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      errors={errors}
    />
  );
}

EditProfileContainer.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
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
