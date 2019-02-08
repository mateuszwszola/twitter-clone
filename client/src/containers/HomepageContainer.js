import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Homepage from '../components/Homepage';
import Loading from '../components/Loading';
import { fetchUserProfile } from '../actions/profileActions';

class HomepageContainer extends Component {
  componentDidMount() {
    this.props.fetchUserProfile();
  }

  render() {
    if (this.props.profile.loading || this.props.profile.profile === null) {
      return <Loading />;
    }

    return <Homepage profile={this.props.profile.profile} />;
  }
}

HomepageContainer.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = ({ profile, errors }) => ({
  profile,
  errors
});

export default connect(
  mapStateToProps,
  { fetchUserProfile }
)(withRouter(HomepageContainer));
