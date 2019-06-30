import styled from 'styled-components/macro';

export const MainNav = styled.nav`
  list-style: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

export const NavItem = styled.li`
  color: #67757f;
  margin-right: 5px;
`;

export const StyledDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

export const NavAvatar = styled.i`
  font-size: 2rem;
  margin: 10px;
  color: #67757f;
  cursor: pointer;
`;
