import React from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';
import { likeTweet, removeTweet } from 'actions/tweetActions';
import { useUser } from 'context/UserContext';
import { CloseButton, UserAvatar } from 'shared/components';
import { useTweet } from 'utils/tweets';
import Comment from '../Comment';
import {
  Icon,
  ItemGroup,
  LikeIcon,
  LikeTweetAction,
  Main,
  SocialGroup,
  StyledTweet,
  TopFlex,
  TweetAction,
  TweetActionGroup,
  TweetContent,
  TweetDate,
  TweetText,
  TweetUserName,
  TweetUserUsername,
  UserGroup,
  UserInfo,
} from './style';
import DisplayError from 'components/DisplayError';
import Loading from 'components/Loading';
import portraitPlaceholder from 'img/portrait-placeholder.png';

function DisplayTweet({ tweet, handleActionClick }) {
  const user = useUser();

  const {
    author: { _id: authorId, name, username, avatar },
    repliesCount,
    likes,
    createdAt,
    text,
    _id: tweetId,
  } = tweet;

  const liked = !!(user && tweet.likes.includes(user._id));

  return (
    <StyledTweet>
      <Main>
        <TopFlex>
          <UserGroup>
            <Link to={`/profile/${authorId}`}>
              <UserAvatar
                small
                src={avatar || portraitPlaceholder}
                alt={`${name}'s avatar`}
              />
            </Link>

            <UserInfo>
              <ItemGroup>
                <TweetUserName as={Link} to={`/profile/${authorId}`}>
                  {name}
                </TweetUserName>
              </ItemGroup>
              <ItemGroup>
                @
                <TweetUserUsername as={Link} to={`/profile/${authorId}`}>
                  {username}
                </TweetUserUsername>
              </ItemGroup>
            </UserInfo>
          </UserGroup>
        </TopFlex>

        <TweetContent>
          <TweetText>{text}</TweetText>
          <TweetDate>{format(new Date(createdAt), 'MMMM yyyy')}</TweetDate>

          <SocialGroup>
            <ItemGroup>
              <strong>{likes.length}</strong> Likes
            </ItemGroup>
          </SocialGroup>

          <TweetActionGroup>
            <TweetAction>
              <Icon className="far fa-comment" />{' '}
              <strong>{repliesCount}</strong>
            </TweetAction>
            <LikeTweetAction
              onClick={(e) => handleActionClick(e, 'like', tweetId)}
            >
              <LikeIcon className="far fa-heart" liked={liked} />{' '}
              <strong>{likes.length}</strong>
            </LikeTweetAction>
          </TweetActionGroup>
        </TweetContent>
      </Main>

      <Comment tweetId={tweet._id} />
    </StyledTweet>
  );
}

DisplayTweet.propTypes = {
  tweet: PropTypes.object.isRequired,
  handleActionClick: PropTypes.func.isRequired,
};

function TweetModal() {
  const history = useHistory();
  const { tweetId } = useParams();
  const { isLoading, data, error } = useTweet(tweetId);
  const user = useUser();

  function back() {
    if (history.length > 1) {
      history.goBack();
    } else {
      history.push('/');
    }
  }

  function handleActionClick(e, action, tweet_id) {
    e.stopPropagation();
    if (!user) {
      history.push('/signin');
    } else {
      if (action === 'like') {
        likeTweet(tweet_id, user._id);
      } else if (action === 'remove') {
        removeTweet(tweet_id);
      }
    }
  }

  return (
    <DialogOverlay onDismiss={back}>
      <CloseButton />
      <DialogContent
        aria-label="Tweet"
        css={`
          border-radius: 5px;
        `}
      >
        {error ? (
          <DisplayError error={error} />
        ) : isLoading ? (
          <Loading />
        ) : (
          <DisplayTweet
            tweet={data.tweet}
            handleActionClick={handleActionClick}
          />
        )}
      </DialogContent>
    </DialogOverlay>
  );
}

export default TweetModal;
