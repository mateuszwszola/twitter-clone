import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchProfileWithTweets } from '../actions/profileActions';
import Profile from '../components/Profile';
import Loading from '../components/Loading';
import DisplayErrors from '../components/DisplayErrors';

class ProfileContainer extends Component {
  state = {
    errors: {}
  };

  componentWillReceiveProps({ errors }) {
    this.setState(() => ({
      errors
    }));
  }

  componentDidMount() {
    const { username } = this.props.match.params;
    // fetch profile and profile tweets
    this.props.fetchProfileWithTweets(username);
  }

  render() {
    if (this.state.errors.nouser) {
      return <DisplayErrors error={this.state.errors.nouser} />;
    }
    if (this.props.profile.loading || this.props.profile.profile === null) {
      return <Loading />;
    }

    return (
      <div>
        <Profile
          profile={this.props.profile.profile}
          tweet={this.props.tweet}
          user={this.props.profile.profile.user}
          isAuthenticated={this.props.isAuthenticated}
        />
      </div>
    );
  }
}

ProfileContainer.propTypes = {
  fetchProfileWithTweets: PropTypes.func.isRequired,
  tweet: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  tweet: state.tweet,
  profile: state.profile,
  errors: state.errors,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { fetchProfileWithTweets }
)(ProfileContainer);
