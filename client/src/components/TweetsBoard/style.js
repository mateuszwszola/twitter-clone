import styled from 'styled-components/macro';
import { Button } from 'shared/components';

export const Container = styled.div`
  position: relative;
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

export const Board = styled.div`
  background-color: #fff;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.3);
`;

export const HeaderWrapper = styled.div`
  padding: 5px;
  border-bottom: 1px solid #eee;
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

export const LikeItemGroup = styled(ItemGroup)`
  &:hover i {
    color: ${(props) => props.theme.colors.red};
  }
`;

export const Icon = styled.i`
  font-size: 1.25em;
`;

export const LikeIcon = styled(Icon)`
  color: ${(props) => props.theme.colors.red};
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
