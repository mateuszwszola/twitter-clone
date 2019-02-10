import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Homepage from '../components/Homepage';
import Loading from '../components/Loading';
import { getProfileHomepageTweets } from '../actions/tweetActions';
import { fetchUserProfile } from '../actions/profileActions';

class HomepageContainer extends Component {
  componentDidMount() {
    this.props.fetchUserProfile();
    this.props.getProfileHomepageTweets();
  }

  render() {
    if (this.props.profile.loading || this.props.profile.profile === null) {
      return <Loading />;
    }
    return (
      <Homepage profile={this.props.profile.profile} tweet={this.props.tweet} />
    );
  }
}

HomepageContainer.propTypes = {
  getProfileHomepageTweets: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  tweet: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = ({ profile, tweet, errors }) => ({
  profile,
  tweet,
  errors
});

export default connect(
  mapStateToProps,
  { getProfileHomepageTweets, fetchUserProfile }
)(withRouter(HomepageContainer));
