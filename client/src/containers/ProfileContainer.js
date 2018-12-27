import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetchUserProfile from '../functions/fetchUserProfile';
import Profile from '../components/Profile';
import Loading from '../components/Loading';

class ProfileContainer extends Component {
  state = {
    fetchError: null,
    loading: true
  };

  componentDidMount() {
    fetchUserProfile(
      this.props.setUserProfile,
      this.handleFetchUserError,
      this.profileFetched
    );
  }

  profileFetched = () => {
    this.setState(() => ({
      loading: false
    }));
  };

  handleFetchUserError = fetchError => {
    this.setState(() => ({
      fetchError,
      loading: false
    }));
  };

  render() {
    return (
      <div>
        {this.state.loading ? (
          <Loading />
        ) : (
          <Profile
            fetchError={this.state.fetchError}
            profile={this.props.profile}
          />
        )}
      </div>
    );
  }
}

ProfileContainer.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.func.isRequired,
  setUserProfile: PropTypes.func.isRequired
};

export default ProfileContainer;
