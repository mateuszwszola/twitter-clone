import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { FaRegComment, FaHeart, FaRegHeart } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import {
  Container,
  Board,
  HeaderWrapper,
  Header,
  List,
  ListItem,
  ListItemContent,
  TweetUserGroup,
  TweetText,
  TweetBottomGroup,
  TweetUserName,
  TweetUserUsername,
  Icon,
  LikeIcon,
  ItemGroup,
  LikeItemGroup,
  DeleteButton,
} from './style';
import { InfoText, UserAvatar } from 'shared/components';
import Loading from 'components/Loading';
import portraitPlaceholder from 'img/portrait-placeholder.png';
import { useUser } from 'context/UserContext';
import { useRemoveTweet, useTweetLike, useTweetUnlike } from 'utils/tweets';

function TweetsBoard({ loading, tweets }) {
  const user = useUser();
  const history = useHistory();
  const removeTweetMutation = useRemoveTweet();
  const likeTweetMutation = useTweetLike();
  const unlikeTweetMutation = useTweetUnlike();

  const handleTweetClick = (tweet) => {
    const { author, _id: tweetId } = tweet;
    history.push({
      pathname: `/${author._id}/status/${tweetId}`,
      state: { modal: true },
    });
  };

  const handleActionClick = (action, tweetId) => (e) => {
    e.stopPropagation();
    if (user) {
      if (action === 'like') {
        likeTweetMutation.mutate(tweetId);
      } else if (action === 'unlike') {
        unlikeTweetMutation.mutate(tweetId);
      } else if (action === 'remove') {
        removeTweetMutation.mutate(tweetId);
      }
    } else {
      history.push({
        pathname: '/signin',
      });
    }
  };

  return (
    <Container>
      {tweets === null || loading ? (
        <Loading />
      ) : (
        <Board>
          <HeaderWrapper>
            <Header>Tweets</Header>
          </HeaderWrapper>
          <List>
            {tweets.length > 0 ? (
              tweets.map((tweet) => {
                const owner = user && user._id === tweet.author._id;
                const liked = !!(user && tweet.likes.includes(user._id));
                return (
                  <ListItem
                    key={tweet._id}
                    onClick={() => handleTweetClick(tweet)}
                  >
                    <UserAvatar
                      small
                      src={tweet.author.avatar || portraitPlaceholder}
                      alt="User Avatar"
                    />
                    <ListItemContent>
                      <TweetUserGroup>
                        <ItemGroup>
                          <TweetUserName>{tweet.author.name}</TweetUserName>
                        </ItemGroup>
                        <ItemGroup>
                          @
                          <TweetUserUsername>
                            {tweet.author.username}
                          </TweetUserUsername>
                        </ItemGroup>
                        <ItemGroup>
                          <span>
                            {format(new Date(tweet.createdAt), 'MMMM yyyy')}
                          </span>
                        </ItemGroup>
                      </TweetUserGroup>
                      <div>
                        <TweetText>{tweet.text}</TweetText>
                      </div>
                      <TweetBottomGroup>
                        <ItemGroup>
                          <Icon as={FaRegComment} />{' '}
                          <span>{tweet.repliesCount}</span>
                        </ItemGroup>
                        <LikeItemGroup
                          onClick={handleActionClick(
                            liked ? 'unlike' : 'like',
                            tweet._id
                          )}
                        >
                          <LikeIcon as={liked ? FaHeart : FaRegHeart} />{' '}
                          {tweet.likes.length}
                        </LikeItemGroup>
                      </TweetBottomGroup>
                    </ListItemContent>
                    {owner ? (
                      <DeleteButton
                        onClick={handleActionClick('remove', tweet._id)}
                        disabled={removeTweetMutation.isLoading}
                      >
                        <IoMdClose />
                      </DeleteButton>
                    ) : null}
                  </ListItem>
                );
              })
            ) : (
              <InfoText>There are no tweets to display</InfoText>
            )}
          </List>
        </Board>
      )}
    </Container>
  );
}

TweetsBoard.propTypes = {
  loading: PropTypes.bool.isRequired,
  tweets: PropTypes.array.isRequired,
};

export default TweetsBoard;
