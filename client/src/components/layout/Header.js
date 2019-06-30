import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AuthNav from './nav/authNav';
import BasicNav from './nav/basicNav';

const Header = ({ isAuthenticated }) => (
  <header className="main-header">
    <div className="header-container">
      <i className="fab fa-twitter header__logo" />
      {isAuthenticated ? <AuthNav /> : <BasicNav />}
    </div>
  </header>
);

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = ({ auth }) => ({
  isAuthenticated: auth.isAuthenticated
});

export default connect(mapStateToProps)(Header);
