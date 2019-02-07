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

    fetchProfileWithTweets(username);
  }

  render() {
    if (this.state.errors.length) {
      return <DisplayErrors errors={Object.values(this.state.errors)} />;
    }

    if (this.props.profile.loading || this.props.tweet.loading) {
      return <Loading />;
    }

    return (
      <div>
        <Profile
          profile={this.props.profile}
          tweets={this.props.tweet.tweets}
          user={this.props.profile.user}
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
