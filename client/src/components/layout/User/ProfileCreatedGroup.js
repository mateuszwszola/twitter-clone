import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileCreatedGroup = ({ created }) => (
  <p className="user-info-joined">
    <i className="fas fa-calendar-alt" /> Joined{' '}
    <Moment format="MMMM YYYY" withTitle>
      {created}
    </Moment>
  </p>
);

ProfileCreatedGroup.propTypes = {
  created: PropTypes.string.isRequired
};

export default ProfileCreatedGroup;
