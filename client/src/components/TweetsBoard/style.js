import styled from 'styled-components/macro';
import { Button } from 'shared/components';

export const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  margin: 0 auto;
`;

export const HeaderWrapper = styled.div`
  padding: 5px;
`;

export const Header = styled.h3`
  margin: 5px;
`;

export const List = styled.ul`
  width: 100%;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #eee;
  &:first-child {
    border-top: none;
  }
`;

export const ListItem = styled.li`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 7px 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;

  &:hover {
    background-color: #eee;
  }

  &:last-child {
    border: none;
  }
`;

export const ListItemContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

export const TweetUserGroup = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const TweetText = styled.p`
  margin: 5px;
`;

export const TweetBottomGroup = styled.div`
  margin-top: 10px;

  button {
    background: none;
    border: 0;
    cursor: pointer;
    margin-left: 10px;
  }
`;

export const TweetUserName = styled.span`
  font-weight: bold;
`;

export const TweetUserUsername = styled.span`
  font-weight: bold;
`;

export const ItemGroup = styled.span`
  padding: 0 5px;
`;

export const DeleteButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
`;

export const InfoText = styled.p`
  text-align: center;
  padding: 10px 15px;
  font-size: 1.15em;
  color: ${(props) => props.theme.colors.darkGray};
`;
