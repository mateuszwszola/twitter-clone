import React, { Component } from 'react';
import { fetchProfile } from '../utils/api';
import Profile from '../components/Profile';
import Loading from '../components/Loading';
import DisplayError from '../components/DisplayError';
import { ProfileContext } from '../ProfileContext';
import { withUserContext } from '../UserContext';

class ProfileContainer extends Component {
  static contextType = ProfileContext;
  state = {
    loading: true,
    error: null
  };

  componentDidMount() {
    const { username } = this.props.match.params;
    fetchProfile(username, this.handleSuccess, this.handleError);
  }

  handleSuccess = profile => {
    this.context.setCurrentUserProfile(profile);
    this.setState(() => ({
      loading: false,
      error: null
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
    if (error) {
      return <DisplayError error={Object.values(error)[0].toString()} />;
    }

    if (loading) {
      return <Loading />;
    }

    return (
      <div>
        <Profile
          profile={this.context.currentUserProfile}
          user={this.props.user}
          isAuthenticated={this.props.isAuthenticated}
        />
      </div>
    );
  }
}

export default withUserContext(ProfileContainer);
