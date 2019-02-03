import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Homepage from '../components/Homepage';
import Loading from '../components/Loading';
import DisplayErrors from '../components/DisplayErrors';
import { fetchUserProfile } from '../actions/profileActions';

class HomepageContainer extends Component {
  state = {
    errors: null
  };

  componentDidMount() {
    fetchUserProfile();
  }

  componentWillReceiveProps({ errors }) {
    this.setState(() => ({ errors }));
  }

  render() {
    if (this.props.profile.loading) {
      return <Loading />;
    }

    if (this.state.errors) {
      return <DisplayErrors error={this.state.errors} />;
    }

    return <Homepage profile={this.props.profile.currentProfile} />;
  }
}

const mapStateToProps = ({ profile, errors }) => ({
  profile,
  errors
});

export default connect(
  mapStateToProps,
  { fetchUserProfile }
)(withRouter(HomepageContainer));
