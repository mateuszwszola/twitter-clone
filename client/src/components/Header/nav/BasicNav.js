import React from 'react';
import { StyledNavLink } from 'shared/components';
import { MainNav, NavItem } from './style';

export default function BasicNav() {
  return (
    <MainNav>
      <NavItem>
        <StyledNavLink to="/">Home</StyledNavLink>
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
    </MainNav>
  );
}
