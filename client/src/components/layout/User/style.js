import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

export const StyledUserName = styled.h2`
  margin: 5px;
  color: #000;
`;

export const StyledUserUsername = styled.p`
  margin: 5px;
  color: #67757f;
`;

export const UserInfoLink = styled(Link)`
  :hover {
    border-bottom: 2px solid;
  }
  font-size: 0.9em;
`;

export const UserInfoJoined = styled.p`
  margin: 10px 5px;
`;

export const ListItem = styled.li`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
  padding: 10px;
`;

export const Key = styled.span`
  font-size: 1em;
  color: ${props => props.theme.colors.darkGray};
  font-weight: bold;
`;

export const Value = styled.span`
  font-size: 1.3em;
  color: ${props => props.theme.colors.blue};
  font-weight: bold;
`;

export const ProfileHeaderMenu = styled.div`
  background-color: #fff;
  color: #67757f;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  -webkit-box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2);
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2);
`;

export const HeaderMenuList = styled.ul`
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
`;
