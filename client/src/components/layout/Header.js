import React from 'react';
import Nav from './Nav';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="main-header">
      <Link to="/" className="header-logo">
        Twitter clone
      </Link>
      <Nav />
    </header>
  );
}
