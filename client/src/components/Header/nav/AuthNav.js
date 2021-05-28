import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { keyframes } from 'styled-components/macro';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuLink,
  MenuPopover,
  MenuItems,
} from '@reach/menu-button';
import '@reach/menu-button/styles.css';
import { useAuth } from 'context/AuthContext';
import { Button, StyledNavLink } from 'shared/components';
import { NavAvatar, NavItem } from './style';
import { FaUserCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';

const slideDown = keyframes`
  0% {
      opacity: 0;
      transform: translateY(-10px);
  }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
`;

function AuthNav() {
  const { user, logout } = useAuth();
  const history = useHistory();
  const location = useLocation();

  return (
    <>
      <NavItem>
        <StyledNavLink exact to="/">
          Home
        </StyledNavLink>
      </NavItem>
      <NavItem>
        <Button
          primary
          type="text"
          onClick={() =>
            history.push({
              pathname: '/compose/tweet',
              state: { background: location },
            })
          }
        >
          Tweet
        </Button>
      </NavItem>
      <NavItem>
        <Menu>
          <MenuButton
            data-cy="auth-nav-dropdown-button"
            css={`
              background: none;
              border: none;
            `}
            aria-label="Actions"
          >
            <span aria-hidden>
              <NavAvatar />
            </span>
          </MenuButton>
          <MenuPopover
            css={`
              background-color: #f9f9f9;
              min-width: 160px;
              box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
              border-radius: 4px;
              font-size: 1.2rem;
              animation: ${slideDown} 0.2s ease;
            `}
          >
            <div
              css={`
                padding: 12px;
                border-bottom: 1px solid ${(props) => props.theme.colors.gray};
              `}
            >
              <p
                css={`
                  font-size: 1.2rem;
                  font-weight: bold;
                `}
              >
                {user.name}
              </p>
              <p>@{user.username}</p>
            </div>
            <MenuItems>
              <MenuLink as={Link} to={`/profile/${user._id}`}>
                <FaUserCircle
                  css={`
                    margin-right: 10px;
                  `}
                />
                Profile
              </MenuLink>
              <MenuLink as={Link} to={`/settings`}>
                <FaCog
                  css={`
                    margin-right: 10px;
                  `}
                />
                Settings
              </MenuLink>
              <MenuItem data-cy="auth-nav-logout-button" onSelect={logout}>
                <FaSignOutAlt
                  css={`
                    margin-right: 10px;
                  `}
                />
                Sign Out
              </MenuItem>
            </MenuItems>
          </MenuPopover>
        </Menu>
      </NavItem>
    </>
  );
}

export default AuthNav;
