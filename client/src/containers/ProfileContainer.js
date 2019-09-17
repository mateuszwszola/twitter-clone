import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { getProfileByUsername } from 'actions/profileActions';
import Profile from 'components/Profile';
import Loading from 'components/Loading';
import DisplayErrors from 'components/DisplayErrors';
import { TweetModal } from 'components/Tweet';
import isEmpty from 'utils/isEmpty';

function ProfileContainer({ profile, getProfileByUsername, errors, match }) {
  const { username } = match.params;

  useEffect(() => {
    getProfileByUsername(username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  if (!isEmpty(errors)) {
    return <DisplayErrors errors={errors} />;
  }

  return (
    <>
      {profile.profile === null ? <Loading /> : <Profile profile={profile} />}
      <Route path={`${match.path}/status/:status_id`} component={TweetModal} />
    </>
  );
}

ProfileContainer.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.array.isRequired,
  getProfileByUsername: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getProfileByUsername }
)(ProfileContainer);
