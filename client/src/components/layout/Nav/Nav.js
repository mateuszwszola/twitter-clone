import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SignOut from '../SignOut';
import { withUserContext } from '../../UserContext';

import * as ROUTES from '../../constants/routes';

function Nav({ isAuthenticated, user }) {
  const authLinks = (
    <>
      <Link to="/profile">{user.username}</Link>
      <SignOut />
    </>
  );

  const basicLinks = (
    <>
      <Link to={ROUTES.HOMEPAGE}>Homepage</Link>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </>
  );
  return (
    <nav className="main-nav">{isAuthenticated ? authLinks : basicLinks}</nav>
  );
}

Nav.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired
};

export default withUserContext(Nav);
