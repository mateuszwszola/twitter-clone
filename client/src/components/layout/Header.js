import React from 'react';
import Nav from './Nav';

export default function Header(props) {
  return (
    <header className="main-header">
      <i className="fab fa-twitter header-logo" />
      <Nav />
    </header>
  );
}
