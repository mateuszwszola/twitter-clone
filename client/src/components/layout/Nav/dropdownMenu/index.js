import React from 'react';
import PropTypes from 'prop-types';
import { DropdownLink, SignoutButton } from 'shared/components';
import Loading from 'components/Loading';
import {
  Wrapper,
  Menu,
  MenuItem,
  MenuName,
  MenuUsername,
  UserInfo
} from './style';

function DropdownMenu({ user, onLogout }) {
  if (user === null) {
    return (
      <Wrapper>
        <Loading />
      </Wrapper>
    );
  }

  let link = user.username ? '/' + user.username.toString() : '/';

  return (
    <Wrapper>
      <Menu>
        <UserInfo>
          <MenuItem>
            <MenuName>{user.name || 'Unknown'}</MenuName>
          </MenuItem>
          <MenuItem>
            @<MenuUsername>{user.username || 'Unknown'}</MenuUsername>
          </MenuItem>
        </UserInfo>
        <MenuItem>
          <DropdownLink to={link}>
            <i className="far fa-user" /> Profile
          </DropdownLink>
        </MenuItem>
        <MenuItem>
          <DropdownLink to="/settings">
            <i className="fas fa-cog" /> Settings
          </DropdownLink>
        </MenuItem>
        <MenuItem>
          <DropdownLink to="/notfound">404 not found</DropdownLink>
        </MenuItem>
        <MenuItem>
          <SignoutButton onClick={onLogout}>
            <i className="fas fa-sign-out-alt" /> Sign Out
          </SignoutButton>
        </MenuItem>
      </Menu>
    </Wrapper>
  );
}

DropdownMenu.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func.isRequired
};

export default DropdownMenu;
