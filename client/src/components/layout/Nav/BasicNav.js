import React from 'react';
import { StyledLink } from '../../UI/Link';

export default function BasicNav() {
  return (
    <nav className="main-nav">
      <li className="nav__item">
        <StyledLink to="/">
          <i className="fas fa-home" /> Home
        </StyledLink>
      </li>
      <li className="nav__item">
        <StyledLink to="/signin">Sign In</StyledLink>
      </li>
      <li className="nav__item">
        <StyledLink to="/signup">Sign Up</StyledLink>
      </li>
    </nav>
  );
}
