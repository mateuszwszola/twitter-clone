import React from 'react';
import AuthNav from './nav/AuthNav';
import BasicNav from './nav/BasicNav';
import { StyledHeader } from './style';
import { useUser } from 'context/UserContext';
import { StyledNavLink } from 'shared/components';
import { MainNav } from './nav/style';

const Header = () => {
  const user = useUser();

  return (
    <StyledHeader>
      <MainNav>
        <ul>
          <StyledNavLink to="/profiles">All profiles</StyledNavLink>
          <div>{user ? <AuthNav /> : <BasicNav />}</div>
        </ul>
      </MainNav>
    </StyledHeader>
  );
};

export default Header;
