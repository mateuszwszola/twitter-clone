import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Homepage from 'components/Homepage';
import Loading from 'components/Loading';
import { getUserProfileWithHomepageTweets } from 'actions/profileActions';

function HomepageContainer({
  getUserProfileWithHomepageTweets,
  profile,
  tweet,
  errors
}) {
  useEffect(() => {
    getUserProfileWithHomepageTweets();
  }, []);

  if (profile.loading || profile.profile === null) {
    return <Loading />;
  }

  return <Homepage profile={profile.profile} tweet={tweet} />;
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
