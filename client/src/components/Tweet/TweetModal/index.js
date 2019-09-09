import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Moment from 'react-moment';
import { getTweetById, removeTweet, likeTweet, retweetTweet } from 'actions/tweetActions';
import Loading from 'components/Loading';
import TweetsBoard from 'components/layout/TweetsBoard';
import portretPlaceholder from 'img/portret-placeholder.png';
import {
  Container,
  StyledTweet,
  Main,
  TweetContent,
  TopFlex,
  ItemGroup,
  TweetUserName,
  TweetUserUsername,
  TweetText,
  Icon,
  LikeIcon,
  TweetDate,
  UserGroup,
  UserInfo,
  SocialGroup,
  TweetActionGroup,
  TweetAction,
  LikeTweetAction
} from './style';
import { UserAvatar, CloseButton } from 'shared/components';
import AddComment from '../AddComment';

function TweetModal({
  back,
  containerRef,
  closeButtonRef,
  tweet,
  liked,
  handleActionClick
}) {
  return createPortal(
    <Container onClick={back} ref={containerRef}>
      <CloseButton ref={closeButtonRef} />
      <StyledTweet>
        <Main>
          <TopFlex>
            <UserGroup>
              <Link to={`/${tweet.user.username}`}>
                <UserAvatar
                  small
                  src={tweet.user.avatar || portretPlaceholder}
                  alt={`${tweet.user.name} avatar`}
                />
              </Link>
              <UserInfo>
                <ItemGroup>
                  <TweetUserName as={Link} to={`/${tweet.user.username}`}>
                    {tweet.user.name}
                  </TweetUserName>
                </ItemGroup>
                <ItemGroup>
                  @
                  <TweetUserUsername as={Link} to={`/${tweet.user.username}`}>
                    {tweet.user.username}
                  </TweetUserUsername>
                </ItemGroup>
              </UserInfo>
            </UserGroup>
          </TopFlex>

          <TweetContent>
            <TweetText>{tweet.text}</TweetText>
            <TweetDate>
              <Moment format="DD/MM/YYYY" withTitle>
                {tweet.created}
              </Moment>
            </TweetDate>

            <SocialGroup>
              <ItemGroup>
                <strong>{tweet.retweets.length} </strong> Retweets
              </ItemGroup>
              <ItemGroup>
                <strong>{tweet.likes.length}</strong> Likes
              </ItemGroup>
            </SocialGroup>

            <TweetActionGroup>
              <TweetAction>
                <Icon
                  className="far fa-comment"
                  onClick={() => alert('Comment')}
                />{' '}
                <strong>{tweet.comments.length}</strong>
              </TweetAction>
              <TweetAction>
                <Icon
                  className="fas fa-retweet"
                  onClick={(e) => handleActionClick(e, 'retweet', tweet._id)}
                />{' '}
                <strong>{tweet.retweets.length}</strong>
              </TweetAction>
              <LikeTweetAction
                onClick={e => handleActionClick(e, 'like', tweet._id)}
              >
                <LikeIcon className="far fa-heart" liked={liked} />{' '}
                <strong>{tweet.likes.length}</strong>
              </LikeTweetAction>
            </TweetActionGroup>
          </TweetContent>
        </Main>

        <AddComment />
        <TweetsBoard tweets={tweet.comments} comments={true} />
      </StyledTweet>
    </Container>,
    document.getElementById('root')
  );
}

TweetModal.propTypes = {
  back: PropTypes.func.isRequired,
  tweet: PropTypes.object.isRequired,
  handleActionClick: PropTypes.func.isRequired,
  liked: PropTypes.bool.isRequired
};

function TweetModalContainer(props) {
  const { status_id } = props.match.params;
  const containerRef = useRef(null);
  const closeButtonRef = useRef(null);

  const {
    auth,
    tweet: { tweet, loading },
    getTweetById,
    removeTweet,
    likeTweet,
      retweetTweet,
    history
  } = props;

  useEffect(() => {
    if (!tweet) {
      getTweetById(status_id);
    }
  }, [status_id, tweet]);

  const back = e => {
    if (
      e.target !== containerRef.current &&
      e.target !== closeButtonRef.current
    ) {
      return;
    }
    history.goBack();
  };

  const handleActionClick = (e, action, tweet_id) => {
    e.stopPropagation();
    if (auth.isAuthenticated) {
      if (action === 'like') {
        likeTweet(tweet_id, auth.user._id);
      } else if (action === 'remove') {
        removeTweet(tweet_id);
      } else if (action === 'retweet') {
        retweetTweet(tweet_id, auth.user._id);
      }
    } else {
      history.push('/signin');
    }
  };

  if (loading || !tweet) {
    return <Loading />;
  }

  const liked = !!(
    auth.user && tweet.likes.find(like => like.user === auth.user._id)
  );

  return (
    <TweetModal
      containerRef={containerRef}
      closeButtonRef={closeButtonRef}
      back={back}
      tweet={tweet}
      liked={liked}
      handleActionClick={handleActionClick}
    />
  );
}

TweetModalContainer.propTypes = {
  auth: PropTypes.object.isRequired,
  tweet: PropTypes.object.isRequired,
  errors: PropTypes.array.isRequired,
  getTweetById: PropTypes.func.isRequired,
  removeTweet: PropTypes.func.isRequired,
  likeTweet: PropTypes.func.isRequired,
  retweetTweet: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  tweet: state.tweet,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getTweetById, removeTweet, likeTweet, retweetTweet }
)(withRouter(TweetModalContainer));
