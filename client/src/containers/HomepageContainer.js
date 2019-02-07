import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Homepage from '../components/Homepage';
import Loading from '../components/Loading';
import DisplayErrors from '../components/DisplayErrors';
import { fetchUserProfile } from '../actions/profileActions';

class HomepageContainer extends Component {
  // componentDidMount() {
  //   this.props.fetchUserProfile();
  // }

  render() {
    console.log(this.props);
    return <h1>Homepage</h1>;
    // if (this.props.profile.loading) {
    //   return <Loading />;
    // }

    // if (this.state.errors) {
    //   return <DisplayErrors error={this.state.errors} />;
    // }

    // return <Homepage profile={this.props.profile.currentProfile} />;
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
