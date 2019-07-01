import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AuthNav from '../nav/AuthNav';
import BasicNav from '../nav/BasicNav';
import { StyledHeader, Container, Logo } from './style';

const Header = ({ isAuthenticated }) => (
  <StyledHeader>
    <Container>
      <Logo className="fab fa-twitter" />
      {isAuthenticated ? <AuthNav /> : <BasicNav />}
    </Container>
  </StyledHeader>
);

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = ({ auth }) => ({
  isAuthenticated: auth.isAuthenticated
});

export default connect(mapStateToProps)(Header);
