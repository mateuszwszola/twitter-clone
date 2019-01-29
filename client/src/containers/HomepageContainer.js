import React from 'react';
import Homepage from '../components/Homepage';
import Loading from '../components/Loading';
import DisplayErrors from '../components/DisplayErrors';
import { fetchUserProfile } from '../utils/api';

class HomepageContainer extends React.Component {
  state = {
    profile: null,
    loading: true,
    error: null
  };

  componentDidMount() {
    fetchUserProfile(this.handleSuccess, this.handleError);
  }

  handleSuccess = profile => {
    this.setState(() => ({
      profile,
      loading: false,
      error: null
    }));
  };

  handleError = error => {
    this.setState(() => ({
      profile: null,
      loading: false,
      error
    }));
  };

  render() {
    const { profile, loading, error } = this.state;

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <DisplayErrors error={error} />;
    }

    return <Homepage profile={profile} />;
  }
}

export default HomepageContainer;
