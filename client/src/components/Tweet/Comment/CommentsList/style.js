import styled from 'styled-components/macro';
import { Button } from 'shared/components';

export const Container = styled.div`
  position: relative;
  width: 100%;
`;

export const Header = styled.header`
  padding: 5px;
  border-bottom: 1px solid #eee;
`;

export const Heading = styled.h3`
  margin: 5px;
`;

export const List = styled.ul``;

export const ListItem = styled.li`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 7px 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
`;

export const ListItemContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

export const UserInfoGroup = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const ItemGroup = styled.span`
  padding: 0 5px;
`;

export const CommentText = styled.p`
  margin: 5px;
`;

export const CommentBottomGroup = styled.div`
  margin-top: 10px;
`;

export const CommentUserName = styled.span`
  font-weight: bold;
`;

export const CommentUserUsername = styled.span`
  font-weight: bold;
`;

export const LikeItemGroup = styled(ItemGroup)`
  &:hover i {
    color: ${props => props.theme.colors.red};
  }
`;

export const Icon = styled.i`
  font-size: 1.25em;
`;

export const LikeIcon = styled(Icon)`
  color: ${props =>
    props.liked === true ? props.theme.colors.red : 'inherit'};
`;

export const DeleteButton = styled(Button)`
  background-color: ${props => props.theme.colors.red};
  color: #fff;
  position: absolute;
  right: 10px;
`;

export const InfoText = styled.p`
  text-align: center;
  padding: 10px 15px;
  font-size: 1.15em;
  color: ${props => props.theme.colors.darkGray};
`;
