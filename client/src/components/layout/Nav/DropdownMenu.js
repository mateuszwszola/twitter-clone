import React from 'react';
import PropTypes from 'prop-types';
import { DropdownLink } from '../../UI/Links';

function DropdownMenu({ user }) {
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
          <DropdownLink to={link}>
            <i className="far fa-user" /> Profile
          </DropdownLink>
        </li>
        <li className="dropdown-menu__item">
          <DropdownLink to="/settings">
            <i className="fas fa-cog" /> Settings
          </DropdownLink>
        </li>
        <li className="dropdown-menu__item">
          <DropdownLink to="/notfound">404 not found</DropdownLink>
        </li>
        <li className="dropdown-menu__item">
          <DropdownLink to="/signout">
            <i className="fas fa-sign-out-alt" /> Sign Out
          </DropdownLink>
        </li>
      </ul>
    </div>
  );
}

DropdownMenu.propTypes = {
  user: PropTypes.object.isRequired
};

export default DropdownMenu;
