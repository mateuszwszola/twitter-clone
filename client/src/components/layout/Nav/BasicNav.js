import React from 'react';
import { StyledNavLink } from '../../UI/links';

export default function BasicNav() {
  return (
    <nav className="main-nav">
      <li className="nav__item">
        <StyledNavLink to="/">
          <i className="fas fa-home" /> Home
        </StyledNavLink>
      </li>
      <li className="nav__item">
        <StyledNavLink to="/signin">Sign In</StyledNavLink>
      </li>
      <li className="nav__item">
        <StyledNavLink to="/signup">Sign Up</StyledNavLink>
      </li>
    </nav>
  );
}
