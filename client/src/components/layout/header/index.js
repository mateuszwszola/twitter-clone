import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import AuthNav from '../nav/AuthNav';
import BasicNav from '../nav/BasicNav';
import { StyledHeader, Container, Logo, LeftFlex } from './style';
import { ProfilesButton } from 'shared/components';

const Header = ({ isAuthenticated }) => (
  <StyledHeader>
    <Container>
        <LeftFlex>
          <Logo className="fab fa-twitter" />
          <ProfilesButton as={Link} to="/profiles">All profiles</ProfilesButton>
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
