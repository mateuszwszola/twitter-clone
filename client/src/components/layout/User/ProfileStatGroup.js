import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, Key, Value } from './style';

const ProfileStatGroup = ({ label, value }) => (
  <ListItem>
    <Key>{label}</Key>
    <Value>{value}</Value>
  </ListItem>
);

ProfileStatGroup.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired
};

export default ProfileStatGroup;
