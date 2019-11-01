import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Homepage from 'components/Homepage';
import Loading from 'components/Loading';
import { getUserProfile } from 'actions/profileActions';
import { getUserHomepageTweets } from 'actions/tweetActions';

function HomepageContainer({
  getUserProfile,
  getUserHomepageTweets,
  profile: { profile, loading },
  tweet
}) {
  useEffect(() => {
    getUserProfile();
    getUserHomepageTweets();
  }, [getUserProfile, getUserHomepageTweets]);

  if (profile === null || loading) {
    return <Loading />;
  }

  return <Homepage profile={profile} tweet={tweet} />;
}

HomepageContainer.propTypes = {
  getUserProfile: PropTypes.func.isRequired,
  getUserHomepageTweets: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  tweet: PropTypes.object.isRequired,
  errors: PropTypes.array.isRequired
};

const mapStateToProps = ({ profile, tweet, errors }) => ({
  profile,
  tweet,
  errors
});

export default connect(
  mapStateToProps,
  { getUserProfile, getUserHomepageTweets }
)(HomepageContainer);
