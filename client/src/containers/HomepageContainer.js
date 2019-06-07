import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Homepage from '../components/Homepage';
import Loading from '../components/Loading';
import { getUserProfileWithHomepageTweets } from '../actions/profileActions';

class HomepageContainer extends Component {
  componentDidMount() {
    this.props.getUserProfileWithHomepageTweets();
  }

  render() {
    const { profile, tweet, errors } = this.props;

    if (profile.loading || profile.profile === null) {
      return <Loading />;
    }

    return <Homepage profile={profile.profile} tweet={tweet} />;
  }
}

HomepageContainer.propTypes = {
  getUserProfileWithHomepageTweets: PropTypes.func.isRequired,
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
  { getUserProfileWithHomepageTweets }
)(HomepageContainer);
