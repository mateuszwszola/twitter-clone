import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetchUserProfile from '../functions/fetchUserProfile';
import Profile from '../components/Profile';

class ProfileContainer extends Component {
  state = {
    fetchError: null,
    loading: true
  };

  componentDidMount() {
    if (this.props.isAuthenticated === false) {
      this.props.history.push('/signin');
    } else {
      fetchUserProfile(
        this.props.setUserProfile,
        this.handleFetchUserError,
        this.fetchedProfile
      );
    }
  }

  fetchedProfile = () => {
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
          <div>Loading...</div>
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
