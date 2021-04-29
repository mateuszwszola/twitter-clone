import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';
import DisplayError from 'components/DisplayError';
import Loading from 'components/Loading';
import { useUser } from 'context/UserContext';
import { format } from 'date-fns';
import portraitPlaceholder from 'img/portrait-placeholder.png';
import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { CloseButton, UserAvatar } from 'shared/components';
import { useTweet, useTweetLike, useTweetUnlike } from 'utils/tweets';
import Comment from './Comment';
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

function DisplayTweet({ tweetId }) {
  const history = useHistory();
  const user = useUser();
  const { isLoading, data, error } = useTweet(tweetId);
  const tweetLikeMutation = useTweetLike();
  const unlikeTweetMutation = useTweetUnlike();

  const handleActionClick = (action) => (e) => {
    e.stopPropagation();
    if (!user) {
      history.push('/signin');
    } else {
      if (action === 'like') {
        tweetLikeMutation.mutate(tweetId);
      } else if (action === 'unlike') {
        unlikeTweetMutation.mutate(tweetId);
      }
    }
  };

  if (error) {
    return <DisplayError error={error} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  const {
    author: { _id: authorId, name, username, avatar },
    repliesCount,
    likes,
    createdAt,
    text,
  } = data.tweet;

  const liked = !!(user && likes.includes(user._id));

  return (
    <StyledTweet>
      {tweetLikeMutation.isError && (
        <DisplayError error={tweetLikeMutation.error} />
      )}

      {unlikeTweetMutation.isError && (
        <DisplayError error={tweetLikeMutation.error} />
      )}
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
              onClick={handleActionClick(liked ? 'unlike' : 'like')}
            >
              <LikeIcon className="far fa-heart" liked={liked} />{' '}
              <strong>{likes.length}</strong>
            </LikeTweetAction>
          </TweetActionGroup>
        </TweetContent>
      </Main>

      <Comment tweetId={tweetId} />
    </StyledTweet>
  );
}

DisplayTweet.propTypes = {
  tweetId: PropTypes.string.isRequired,
};

export function TweetModal() {
  const history = useHistory();
  const { tweetId } = useParams();

  function back() {
    if (history.length > 1) {
      history.goBack();
    } else {
      history.push('/');
    }
  }

  return (
    <DialogOverlay onDismiss={back}>
      <CloseButton />
      <DialogContent
        aria-label="Tweet"
        css={`
          border-radius: 5px;
          max-width: 650px;
        `}
      >
        <DisplayTweet tweetId={tweetId} />
      </DialogContent>
    </DialogOverlay>
  );
}

export default DisplayTweet;
