import styled from 'styled-components/macro';

export const Container = styled.div`
  position: fixed;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
`;

export const ListItem = styled.li`
  border-radius: 5px;
  margin: auto;
  background-color: #fff;
  width: 80%;
  display: flex;
  flex-direction: row;
  padding: 7px 12px;
  cursor: pointer;
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

export const Icon = styled.i``;

export const CommentContainer = styled.div``;
