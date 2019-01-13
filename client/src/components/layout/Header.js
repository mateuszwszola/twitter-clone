import React from 'react';
import PropTypes from 'prop-types';
import AuthNav from './Nav/AuthNav';
import BasicNav from './Nav/BasicNav';
import { withUserContext } from '../../UserContext';

function Header({ isAuthenticated, user, authenticateUser }) {
  return (
    <header className="main-header">
      <i className="fab fa-twitter header__logo" />
      {isAuthenticated ? (
        <AuthNav user={user} authenticateUser={authenticateUser} />
      ) : (
        <BasicNav />
      )}
    </header>
  );
}

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  authenticateUser: PropTypes.func.isRequired
};

export default withUserContext(Header);
