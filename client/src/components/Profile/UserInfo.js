import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { UserAvatar } from './UserAvatar';
import avatar from '../../img/tiger-avatar-example.jpg';

// import { profileData } from './dummydata';

const UserInfo = ({ profile }) => (
  <div className="profile-user-info">
    <UserAvatar src={avatar} alt="User Avatar" />
    <h1 className="user-info-name">
      <Link to={`/${profile.user.username}`} className="user-info-link">
        {profile.user.name}
      </Link>
    </h1>
    <p className="user-info-username">
      @
      <Link to={`/${profile.user.username}`} className="user-info-link">
        {profile.user.username}
      </Link>
    </p>
    <p className="user-info-joined">
      <i className="fas fa-calendar-alt" /> Joined{' '}
      <Moment format="MMMM YYYY" withTitle>
        {profile.created}
      </Moment>
    </p>
  </div>
);

UserInfo.propTypes = {
  profile: PropTypes.object.isRequired
};

export default UserInfo;
