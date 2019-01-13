import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const StyledLink = styled(Link)`
  padding: 15px;
  display: block;
`;

export const DropdownLink = styled(StyledLink)`
  color: black;
  display: block;
  width: 100%;
  border-radius: 0px;
`;

export default StyledLink;
