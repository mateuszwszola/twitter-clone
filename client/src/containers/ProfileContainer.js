import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchProfileWithTweets } from '../actions/profileActions';
import Profile from '../components/Profile';
import Loading from '../components/Loading';
import DisplayErrors from '../components/DisplayErrors';

class ProfileContainer extends Component {
  state = {
    errors: {},
    redirect: false
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

  handleFollowClick = () => {
    console.log('Follow button clicked!');
    if (!this.props.auth.isAuthenticated) {
      this.setState(() => ({ redirect: true }));
    }

    // User is authenticated
  };

  handleEditProfileClick = () => {
    console.log('Edit profile button clicked!');
  };

  render() {
    const { profile, tweet, auth } = this.props;

    if (this.state.errors.nouser) {
      return <DisplayErrors error={this.state.errors.nouser} />;
    }
    if (profile.loading || profile.profile === null) {
      return <Loading />;
    }

    return (
      <div>
        <Profile profile={profile.profile} tweet={tweet} auth={auth} />
      </div>
    );
  }
}

ProfileContainer.propTypes = {
  fetchProfileWithTweets: PropTypes.func.isRequired,
  tweet: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  tweet: state.tweet,
  profile: state.profile,
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { fetchProfileWithTweets }
)(ProfileContainer);
