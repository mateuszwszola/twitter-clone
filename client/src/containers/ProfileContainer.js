import React, { Component } from 'react';
import { fetchUserProfile } from '../utils/api';
import Profile from '../components/Profile';
import Loading from '../components/Loading';
import { ProfileContext } from '../ProfileContext';

class ProfileContainer extends Component {
  static contextType = ProfileContext;
  state = {
    loading: true,
    error: null
  };

  componentDidMount() {
    fetchUserProfile(this.handleSuccess, this.handleError);
  }

  handleSuccess = profile => {
    this.context.setCurrentUserProfile(profile);
    this.setState(() => ({
      error: null,
      loading: false
    }));
  };

  handleError = error => {
    this.setState(() => ({
      error,
      loading: false
    }));
  };

  render() {
    const { loading, error } = this.state;
    console.log(this.context);
    return (
      <div>
        {loading ? (
          <Loading />
        ) : (
          <Profile error={error} profile={this.context.currentProfile} />
        )}
      </div>
    );
  }
}

export default ProfileContainer;
