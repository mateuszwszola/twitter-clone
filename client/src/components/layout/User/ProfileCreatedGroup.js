import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { UserInfoJoined } from './style';

const ProfileCreatedGroup = ({ created }) => (
  <UserInfoJoined>
    <i className="fas fa-calendar-alt" /> Joined{' '}
    <Moment format="MMMM YYYY" withTitle>
      {created}
    </Moment>
  </UserInfoJoined>
);

ProfileCreatedGroup.propTypes = {
  created: PropTypes.string.isRequired
};

export default ProfileCreatedGroup;
