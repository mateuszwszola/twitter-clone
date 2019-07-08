import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfileWithTweetsByUsername } from 'actions/profileActions';
import Profile from 'components/Profile';
import Loading from 'components/Loading';
import DisplayErrors from 'components/DisplayErrors';
import isEmpty from 'utils/isEmpty';

function ProfileContainer({
  match,
  auth,
  profile,
  tweet,
  getProfileWithTweetsByUsername,
  errors
}) {
  const [owner, setOwner] = useState(false);
  // TODO: Check if user is the owner
  // 1. User is the owner
  // 2. User is not the owner but they are logged in so they can follow/unfollow etc.
  // 3. There is anonymous user who can only view it
  // 4. UI for 2 and 3 is almost the same. But for 3. when user clicks follow it will popup that you need to be authenticated to follow that user
  const { username } = match.params;
  useEffect(() => {
    if (auth.user && auth.user.username === username) {
      setOwner(true);
    } else {
      setOwner(false);
    }
  }, [auth, username]);

  useEffect(() => {
    getProfileWithTweetsByUsername(username);
  }, [username]);

  if (!isEmpty(errors)) {
    return <DisplayErrors error={errors.message} />;
  }

  if (profile.loading || profile.profile === null) {
    return <Loading />;
  }

  const followed =
    auth.user &&
    profile.profile.followers.find(follower => follower.user === auth.user._id)
      ? true
      : false;

  return (
    <div>
      {owner ? <h1>Owner</h1> : <h1>Not the owner</h1>}
      <Profile
        profile={profile.profile}
        tweet={tweet}
        owner={owner}
        isAuthenticated={auth.isAuthenticated}
        followed={followed}
      />
    </div>
  );
}

ProfileContainer.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getProfileWithTweetsByUsername: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  tweet: state.tweet,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getProfileWithTweetsByUsername }
)(ProfileContainer);

// class ProfileContainer extends Component {
//   state = {
//     errors: {},
//     redirect: false
//   };

//   componentWillReceiveProps({ errors }) {
//     this.setState(() => ({
//       errors
//     }));
//   }

//   componentDidMount() {
//     const { username } = this.props.match.params;
//     // fetch profile and profile tweets
//     this.props.fetchProfileWithTweets(username);
//   }

//   handleFollowClick = () => {
//     console.log('Follow button clicked!');
//     if (!this.props.auth.isAuthenticated) {
//       this.setState(() => ({ redirect: true }));
//     }

//     // User is authenticated
//   };

//   handleEditProfileClick = () => {
//     console.log('Edit profile button clicked!');
//   };

//   render() {
//     const { profile, tweet, auth } = this.props;

//     if (this.state.errors.nouser) {
//       return <DisplayErrors error={this.state.errors.nouser} />;
//     }
//     if (profile.loading || profile.profile === null) {
//       return <Loading />;
//     }

//     return (
//       <div>
//         <Profile profile={profile.profile} tweet={tweet} auth={auth} />
//       </div>
//     );
//   }
// }

// ProfileContainer.propTypes = {
//   fetchProfileWithTweets: PropTypes.func.isRequired,
//   tweet: PropTypes.object.isRequired,
//   profile: PropTypes.object.isRequired,
//   auth: PropTypes.object.isRequired,
//   errors: PropTypes.object.isRequired
// };

// const mapStateToProps = state => ({
//   tweet: state.tweet,
//   profile: state.profile,
//   auth: state.auth,
//   errors: state.errors
// });

// export default connect(
//   mapStateToProps,
//   { fetchProfileWithTweets }
// )(ProfileContainer);
