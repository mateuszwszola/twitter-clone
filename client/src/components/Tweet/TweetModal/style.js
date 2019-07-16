import styled from 'styled-components/macro';
import { Button } from 'shared/components';

export const Container = styled.div`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`;

export const StyledTweet = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  background-color: #fff;
  width: 80%;
  max-width: 650px;
  display: flex;
  flex-direction: column;
  padding-bottom: 30px;
`;

export const Main = styled.div`
  padding: 30px 40px 10px;
`;

export const TopFlex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const UserGroup = styled.div`
  display: flex;
  flex-direction: row;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const FollowButton = styled(Button)`
  height: 100%;
`;

export const TweetContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const UserInfoGroup = styled.div`
  padding: 10px 0;
  display: flex;
  flex-direction: column;
`;
export const TweetText = styled.p`
  font-size: 27px;
  line-height: 32px;
  letter-spacing: 0.01em;
`;

export const TweetDate = styled.p`
  color: ${props => props.theme.colors.darkGray};
  padding: 20px 0;
`;

export const SocialGroup = styled.div`
  padding: 15px;
  border-top: 0.5px solid #eee;
  border-bottom: 0.5px solid #eee;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const TweetActionGroup = styled.div`
  margin: 10px 0 20px;
`;

export const TweetAction = styled.span`
  color: ${props => props.theme.colors.darkGray};
  margin-right: 20px;
  &:last-child {
    margin-right: 0;
  }
  font-size: 1.25em;
  cursor: pointer;
`;

export const LikeTweetAction = styled(TweetAction)`
  &:hover i {
    color: ${props => props.theme.colors.red};
  }
`;

export const TweetBottomGroup = styled.div`
  margin-top: 10px;
`;

export const TweetUserName = styled.span`
  font-size: 18px;
  font-weight: bold;
  &:hover {
    color: ${props => props.theme.colors.blue};
  }
`;

export const TweetUserUsername = styled.span`
  color: ${props => props.theme.colors.gray};
`;

export const ItemGroup = styled.span`
  padding: 0 5px;
  cursor: pointer;
`;

export const LikeItemGroup = styled(ItemGroup)`
  &:hover i {
    color: ${props => props.theme.colors.red};
  }
`;

export const Icon = styled.i``;

export const LikeIcon = styled(Icon)`
  color: ${props =>
    props.liked === true ? props.theme.colors.red : 'inherit'};
`;
