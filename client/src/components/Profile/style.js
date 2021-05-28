import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

export const BackgroundContainer = styled.div`
  height: 200px;
  background: #29a3ef;
  overflow: hidden;
  position: relative;
`;

export const AddBackground = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
  font-size: 1.25rem;
  font-weight: 200;
  color: #fff;
  display: flex;
  align-items: center;
`;

export const AddBackgroundButton = styled.button`
  background: none;
  border: 0;
  display: flex;
  align-items: center;
  margin-left: 5px;
`;

export const Background = styled.img`
  object-fit: cover;
  width: 100%;
  max-width: 100%;
  height: 100%;
`;

export const ProfileTweetsBoard = styled.div`
  margin-bottom: 10px;
`;

export const ProfileHeaderMenu = styled.div`
  margin-top: 15px;
  color: #67757f;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
`;

export const HeaderMenuList = styled.ul`
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
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
  color: ${(props) => props.theme.colors.darkGray};
  font-weight: bold;
`;

export const Value = styled.span`
  font-size: 1.3em;
  color: ${(props) => props.theme.colors.blue};
  font-weight: bold;
`;

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
    color: ${(props) => props.theme.colors.darkerBlue};
  }
  font-size: 0.9em;
`;

export const UserInfoJoined = styled.p`
  margin: 10px 5px;
`;
