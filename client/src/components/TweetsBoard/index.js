import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { FaRegComment, FaHeart, FaRegHeart } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import {
  Container,
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
  ItemGroup,
  DeleteButton,
} from './style';
import {
  InfoText,
  UserAvatar,
  Icon,
  LikeIcon,
  Button,
} from 'shared/components';
import Loading from 'components/Loading';
import portraitPlaceholder from 'img/portrait-placeholder.png';
import { useUser } from 'context/UserContext';
import { useRemoveTweet, useTweetLike, useTweetUnlike } from 'utils/tweets';
import useIntersectionObserver from 'hooks/useIntersectionObserver';
import 'styled-components/macro';

function SingleTweet({ tweet, queryKey }) {
  const user = useUser();
  const history = useHistory();
  const location = useLocation();
  const removeTweetMutation = useRemoveTweet(queryKey);
  const likeTweetMutation = useTweetLike(queryKey);
  const unlikeTweetMutation = useTweetUnlike(queryKey);

  const handleTweetClick = (tweet) => {
    const { author, _id: tweetId } = tweet;
    if (!author) return;

    history.push({
      pathname: `/${author._id}/status/${tweetId}`,
      state: { background: location },
    });
  };

  const handleActionClick = (action, tweetId) => (e) => {
    e.stopPropagation();
    if (!tweet.author) return;

    if (!user) {
      return history.push({
        pathname: '/signin',
      });
    }

    if (action === 'like') {
      likeTweetMutation.mutate(tweetId);
    } else if (action === 'unlike') {
      unlikeTweetMutation.mutate(tweetId);
    } else if (action === 'remove') {
      removeTweetMutation.mutate(tweetId);
    }
  };
  const owner = user && user._id === tweet.author?._id;
  const liked = !!(user && tweet.likes.includes(user._id));

  return (
    <ListItem key={tweet._id} onClick={() => handleTweetClick(tweet)}>
      <UserAvatar
        small
        src={tweet.author?.avatar || portraitPlaceholder}
        alt="User Avatar"
      />
      <ListItemContent>
        <TweetUserGroup>
          <ItemGroup>
            <TweetUserName>{tweet.author?.name || 'unknown'}</TweetUserName>
          </ItemGroup>
          <ItemGroup>
            @
            <TweetUserUsername>
              {tweet.author?.username || 'unknown'}
            </TweetUserUsername>
          </ItemGroup>
          <ItemGroup>
            <span>{format(new Date(tweet.createdAt), 'dd MMMM yyyy')}</span>
          </ItemGroup>
        </TweetUserGroup>
        <div>
          <TweetText>{tweet.text}</TweetText>
        </div>
        <TweetBottomGroup>
          <button disabled={!tweet.author}>
            <Icon as={FaRegComment} /> <span>{tweet.repliesCount}</span>
          </button>
          <button
            onClick={handleActionClick(liked ? 'unlike' : 'like', tweet._id)}
            disabled={!tweet.author}
          >
            <LikeIcon liked={liked}>
              {liked ? <FaHeart /> : <FaRegHeart />}
            </LikeIcon>{' '}
            {tweet.likes.length}
          </button>
        </TweetBottomGroup>
      </ListItemContent>
      {owner ? (
        <DeleteButton
          onClick={handleActionClick('remove', tweet._id)}
          disabled={removeTweetMutation.isLoading || !tweet.author}
        >
          <IoMdClose />
        </DeleteButton>
      ) : null}
    </ListItem>
  );
}

SingleTweet.defaultProps = {
  queryKey: ['tweets', {}],
};

SingleTweet.propTypes = {
  tweet: PropTypes.object.isRequired,
  queryKey: PropTypes.array,
};

function TweetsBoard({
  loading,
  pages,
  headerText,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  queryKey,
}) {
  const loadMoreRef = useRef();

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  const numberOfTweets =
    pages?.reduce((acc, page) => acc + page.results.length, 0) ?? 0;

  return (
    <Container>
      <HeaderWrapper>
        <Header>{headerText}</Header>
      </HeaderWrapper>
      {loading ? (
        <Loading isSmall isFixed={false} />
      ) : (
        <>
          <List>
            {numberOfTweets > 0 ? (
              <>
                {pages.map((group, i) => (
                  <React.Fragment key={i}>
                    {group.results.map((tweet) => (
                      <SingleTweet
                        key={tweet._id}
                        tweet={tweet}
                        queryKey={queryKey}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </>
            ) : (
              <InfoText>There are no tweets to display</InfoText>
            )}
          </List>
          {numberOfTweets > 0 && (
            <div
              css={`
                margin-top: 15px;
                display: flex;
                justify-content: center;
              `}
            >
              <Button
                ref={loadMoreRef}
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
              >
                {isFetchingNextPage
                  ? 'Loading more...'
                  : hasNextPage
                  ? 'Load More'
                  : 'Nothing more to load'}
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
}

TweetsBoard.defaultProps = {
  headerText: 'Tweets',
  queryKey: ['tweets', {}],
};

TweetsBoard.propTypes = {
  queryKey: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  pages: PropTypes.array.isRequired,
  headerText: PropTypes.string.isRequired,
  fetchNextPage: PropTypes.func.isRequired,
  hasNextPage: PropTypes.bool,
  isFetchingNextPage: PropTypes.bool.isRequired,
};

export default TweetsBoard;
