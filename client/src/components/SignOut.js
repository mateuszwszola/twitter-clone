import React from 'react';
import PropTypes from 'prop-types';
import logoutUser from '../functions/logoutUser';

function SignOut(props) {
  return (
    <button
      className="button button--logout"
      onClick={() => logoutUser(props.auth)}
    >
      Sign Out
    </button>
  );
}

SignOut.propTypes = {
  auth: PropTypes.func.isRequired
};

export default SignOut;
