import React, { Component } from 'react';
import Profile from '../components/Profile';
import Loading from '../components/Loading';
import DisplayErrors from '../components/DisplayErrors';
import { ProfileContext } from '../ProfileContext';
import { withUserContext } from '../UserContext';
import axios from 'axios';

class ProfileContainer extends Component {
  static contextType = ProfileContext;
  state = {
    tweets: [],
    profile: {},
    loading: true,
    errors: []
  };

  componentDidMount() {
    const { username } = this.props.match.params;

    axios
      .get(`/api/profiles/profile/${username}`)
      .then(({ data }) => {
        this.setState(() => ({
          profile: data
        }));
        return axios.get(`/api/tweets/all/${data.user._id}`);
      })
      .then(({ data }) => {
        this.setState(() => ({
          tweets: data,
          loading: false,
          errors: []
        }));
      })
      .catch(({ response }) => {
        this.setState(() => ({
          errors: response.data
        }));
      });
  }

  // handleSuccess = profile => {
  //   this.context.setCurrentUserProfile(profile);
  //   this.setState(() => ({
  //     loading: false,
  //     errors: null
  //   }));
  // };

  // handleError = error => {
  //   this.setState(() => ({
  //     error,
  //     loading: false
  //   }));
  // };

  render() {
    const { tweets, profile, loading, errors } = this.state;
    if (errors.length) {
      return <DisplayErrors errors={Object.values(errors)} />;
    }

    if (loading) {
      return <Loading />;
    }

    return (
      <div>
        <Profile
          profile={profile}
          tweets={tweets}
          user={this.props.user}
          isAuthenticated={this.props.isAuthenticated}
        />
      </div>
    );
  }
}

export default withUserContext(ProfileContainer);
