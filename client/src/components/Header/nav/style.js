import styled from 'styled-components/macro';
import { FaUserCircle } from 'react-icons/fa';

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

export const NavAvatar = styled(FaUserCircle)`
  font-size: 2rem;
  color: ${(props) => props.theme.colors.gray};
  cursor: pointer;
`;
