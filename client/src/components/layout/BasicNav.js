import React from 'react';
import { Link } from 'react-router-dom';

export default function BasicNav() {
  return (
    <nav className="main-nav">
      <li className="nav__item">
        <Link to="/">Home</Link>
      </li>
      <li className="nav__item">
        <Link to="/signin">Sign In</Link>
      </li>
      <li className="nav__item">
        <Link to="/signup">Sign Up</Link>
      </li>
    </nav>
  );
}
