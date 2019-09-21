import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AuthNav from '../nav/AuthNav';
import BasicNav from '../nav/BasicNav';
import { StyledHeader, Container, Logo, LeftFlex, ProfilesLink } from './style';

const Header = ({ isAuthenticated }) => (
  <StyledHeader>
    <Container>
        <LeftFlex>
          <Logo className="fab fa-twitter" />
          <ProfilesLink to="/profiles">All profiles</ProfilesLink>
        </LeftFlex>
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
