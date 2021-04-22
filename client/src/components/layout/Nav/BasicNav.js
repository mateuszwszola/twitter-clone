import React from 'react';
import { StyledNavLink } from 'shared/components';
import { MainNav, NavItem } from './style';
import Search from 'components/Search';

export default function BasicNav() {
  return (
    <MainNav>
      <NavItem>
        <Search />
      </NavItem>
      <NavItem>
        <StyledNavLink to="/">
          <i className="fas fa-home" /> Home
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
    </MainNav>
  );
}
