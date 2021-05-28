import PropTypes from 'prop-types';
import 'styled-components/macro';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';
import DisplayError from 'components/DisplayError';
import Loading from 'components/Loading';
import { useUser } from 'context/UserContext';
import { format } from 'date-fns';
import portraitPlaceholder from 'img/portrait-placeholder.png';
import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { CloseButton, UserAvatar, Icon, LikeIcon } from 'shared/components';
import { useTweet, useTweetLike, useTweetUnlike } from 'utils/tweets';
import Comment from './Comment';
import {
  ItemGroup,
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
import { FaHeart, FaRegComment, FaRegHeart } from 'react-icons/fa';
import { queries } from 'shared/layout';

function DisplayTweet({ tweetId }) {
  const history = useHistory();
  const user = useUser();
  const { isLoading, data, error } = useTweet(tweetId);
  const tweetLikeMutation = useTweetLike(['tweets', tweetId]);
  const unlikeTweetMutation = useTweetUnlike(['tweets', tweetId]);

  const handleActionClick = (action) => (e) => {
    e.stopPropagation();
    if (!user) {
      return history.push('/signin');
    }

    if (action === 'like') {
      tweetLikeMutation.mutate(tweetId);
    } else if (action === 'unlike') {
      unlikeTweetMutation.mutate(tweetId);
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
          <TweetDate>{format(new Date(createdAt), 'dd MMMM yyyy')}</TweetDate>

          <SocialGroup>
            <ItemGroup>
              <strong>{likes.length}</strong> Likes
            </ItemGroup>
          </SocialGroup>

          <TweetActionGroup>
            <TweetAction>
              <Icon>
                <FaRegComment />
              </Icon>{' '}
              <span>{repliesCount}</span>
            </TweetAction>
            <TweetAction
              as="button"
              onClick={handleActionClick(liked ? 'unlike' : 'like')}
            >
              <LikeIcon liked={liked}>
                {liked ? <FaHeart /> : <FaRegHeart />}
              </LikeIcon>{' '}
              <span>{likes.length}</span>
            </TweetAction>
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

  const back = (e) => {
    if (e) e.stopPropagation();
    history.goBack();
  };

  return (
    <DialogOverlay onDismiss={back}>
      <CloseButton onClick={back} />
      <DialogContent
        aria-label="Tweet"
        css={`
          width: 100%;
          max-width: 600px;
          border-radius: 5px;
          ${[queries.tiny]} {
            padding: 1rem;
          }
        `}
      >
        <DisplayTweet tweetId={tweetId} />
      </DialogContent>
    </DialogOverlay>
  );
}

export default DisplayTweet;
