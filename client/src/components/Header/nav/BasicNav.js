import React from 'react';
import { StyledNavLink } from 'shared/components';
import { NavItem } from './style';

export default function BasicNav() {
  return (
    <>
      <NavItem>
        <StyledNavLink exact to="/">
          Home
        </StyledNavLink>
      </NavItem>
      <NavItem>
        <StyledNavLink data-cy="nav-signin-link" to="/signin">
          Sign In
        </StyledNavLink>
      </NavItem>
      <NavItem>
        <StyledNavLink data-cy="nav-signup-link" to="/signup">
          Sign Up
        </StyledNavLink>
      </NavItem>
    </>
  );
}
