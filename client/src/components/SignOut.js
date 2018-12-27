import React from 'react';
import PropTypes from 'prop-types';
import { logoutUser } from '../utils/api';
import { withUserContext } from '../UserContext';

function SignOut({ authenticateUser }) {
  return (
    <button
      className="button button--logout"
      onClick={() => logoutUser(authenticateUser)}
    >
      Sign Out
    </button>
  );
}

SignOut.propTypes = {
  authenticateUser: PropTypes.func.isRequired
};

export default withUserContext(SignOut);
