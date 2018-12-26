import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import SignOut from '../SignOut';

import * as ROUTES from '../../constants/routes';

export default function Nav({ auth, isAuthenticated, user }) {
  const authLinks = (
    <>
      <Link to="/profile">{user.username}</Link>
      <SignOut auth={auth} />
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
  user: PropTypes.object.isRequired,
  auth: PropTypes.func.isRequired
};
