import React from 'react';
import PropTypes from 'prop-types';

const ProfileStatGroup = ({ label, value }) => (
  <li className="header-menu-list-item">
    <span className="header-menu-list-item-key">{label}</span>
    <span className="header-menu-list-item-value">{value}</span>
  </li>
);

ProfileStatGroup.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired
};

export default ProfileStatGroup;
