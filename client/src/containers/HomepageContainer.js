import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Homepage from 'components/Homepage';
import Loading from 'components/Loading';
import { getProfile } from 'actions/profileActions';

function HomepageContainer({
  getProfile,
  auth,
  profile: { profile, loading },
  tweet,
}) {
  useEffect(() => {
    getProfile(auth.user._id);
  }, [getProfile]);

  if (profile === null || loading) {
    return <Loading />;
  }

  return <Homepage profile={profile} tweet={tweet} />;
}

HomepageContainer.propTypes = {
  getProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  tweet: PropTypes.object.isRequired,
  errors: PropTypes.array.isRequired,
};

const mapStateToProps = ({ auth, profile, tweet, errors }) => ({
  auth,
  profile,
  tweet,
  errors,
});

export default connect(mapStateToProps, {
  getProfile,
})(HomepageContainer);
