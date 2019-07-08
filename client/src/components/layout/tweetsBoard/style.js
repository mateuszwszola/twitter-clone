import styled from 'styled-components/macro';

export const Container = styled.div`
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

export const Board = styled.div`
  background-color: #fff;
  min-height: 200px;
  -webkit-box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.3);
`;

export const HeaderWrapper = styled.div`
  padding: 5px;
  border-bottom: 1px solid #eee;
`;

export const Header = styled.h3`
  margin: 5px;
`;

export const List = styled.ul``;

export const ListItem = styled.li`
  display: flex;
  flex-direction: row;
  padding: 7px 12px;
  border-bottom: 1px solid #eee;
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
