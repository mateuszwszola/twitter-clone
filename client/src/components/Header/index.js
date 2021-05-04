import React from 'react';
import AuthNav from './nav/AuthNav';
import BasicNav from './nav/BasicNav';
import { StyledHeader, Container, LeftFlex, ProfilesLink } from './style';
import { useUser } from 'context/UserContext';

const Header = () => {
  const user = useUser();

  return (
    <StyledHeader>
      <Container>
        <LeftFlex>
          <ProfilesLink to="/profiles">All profiles</ProfilesLink>
        </LeftFlex>
        {user ? <AuthNav /> : <BasicNav />}
      </Container>
    </StyledHeader>
  );
};

export default Header;
