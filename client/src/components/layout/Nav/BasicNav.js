import React from 'react';
import { StyledNavLink } from '../../../shared/components';
import { MainNav, NavItem } from './style';

export default function BasicNav() {
  return (
    <MainNav>
      <NavItem>
        <StyledNavLink to="/">
          <i className="fas fa-home" /> Home
        </StyledNavLink>
      </NavItem>
      <NavItem>
        <StyledNavLink to="/signin">Sign In</StyledNavLink>
      </NavItem>
      <NavItem>
        <StyledNavLink to="/signup">Sign Up</StyledNavLink>
      </NavItem>
    </MainNav>
  );
}
