import React from 'react';
import PropTypes from 'prop-types';
import { DropdownLink } from '../../UI/Link';
import { SignoutButton } from '../../UI/Button';
import { logoutUser } from '../../../utils/api';

function DropdownMenu({ user, authenticateUser }) {
  let link = user.username ? '/' + user.username.toString() : '/';
  return (
    <div className="dropdown-content">
      <ul className="dropdown-menu">
        <div className="dropdown__user-info">
          <li className="dropdown-menu__item dropdown__name">{user.name}</li>
          <li className="dropdown-menu__item dropdown__username">
            @{user.username}
          </li>
        </div>
        <li className="dropdown-menu__item">
          <DropdownLink to={link}>Profile</DropdownLink>
        </li>
        <li className="dropdown-menu__item">
          <DropdownLink to="/settings">Settings</DropdownLink>
        </li>
        <li className="dropdown-menu__item">
          <DropdownLink to="/notfound">404 not found</DropdownLink>
        </li>
        <li className="dropdown-menu__item">
          <SignoutButton
            onClick={e => {
              e.preventDefault();
              logoutUser(authenticateUser);
            }}
          >
            Sign Out
          </SignoutButton>
        </li>
      </ul>
    </div>
  );
}

DropdownMenu.propTypes = {
  user: PropTypes.object.isRequired,
  authenticateUser: PropTypes.func.isRequired
};

export default DropdownMenu;
