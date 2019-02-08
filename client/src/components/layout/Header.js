import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import AuthNav from './Nav/AuthNav';
import BasicNav from './Nav/BasicNav';

function Header({ isAuthenticated, user, logoutUser }) {
  return (
    <header className="main-header">
      <div className="header-container">
        <i className="fab fa-twitter header__logo" />
        {isAuthenticated ? (
          <AuthNav user={user} onLogout={logoutUser} />
        ) : (
          <BasicNav />
        )}
      </div>
    </header>
  );
}

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired
};

const mapStateToProps = ({ auth }) => ({
  isAuthenticated: auth.isAuthenticated,
  user: auth.user
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Header);
