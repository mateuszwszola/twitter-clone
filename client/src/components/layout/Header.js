import React from 'react';
import Nav from './Nav';
import PropTypes from 'prop-types';

function Header(props) {
  return (
    <header className="main-header">
      <i className="fab fa-twitter header-logo" />
      <Nav
        isAuthenticated={props.isAuthenticated}
        user={props.user}
        auth={props.auth}
      />
    </header>
  );
}

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  auth: PropTypes.func.isRequired
};

export default Header;
