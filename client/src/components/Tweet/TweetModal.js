import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { getTweetById, removeTweet, likeTweet } from 'actions/tweetActions';
import { connect } from 'react-redux';
import Loading from '../Loading';
import TweetsBoard from '../layout/TweetsBoard';
import portretPlaceholder from 'img/portret-placeholder.png';
import Moment from 'react-moment';
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
  FollowButton,
  TweetAction,
  LikeTweetAction
} from './style';
import { UserAvatar, CloseButton } from 'shared/components';
import { Link } from 'react-router-dom';
import AddComment from './AddComment';

// const tweet = {
//   user: {
//     name: 'Bob Doe',
//     username: 'bobdoe'
//   },
//   created: '13-07-2019',
//   text:
//     'Hello everyone, this is my first tweet. I would like to share with you some of my recent thoughts about Tools Of Titans book',
//   comments: [],
//   likes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//   retweets: [1, 2]
// };

function TweetModal({ back, containerRef, tweet, liked, handleActionClick }) {
  return createPortal(
    <Container onClick={back} ref={containerRef}>
      <CloseButton />
      <StyledTweet>
        <Main>
          <TopFlex>
            <UserGroup>
              <Link to={`/${tweet.user.username}`}>
                <UserAvatar
                  small
                  src={tweet.user.avatar || portretPlaceholder}
                  alt="User Avatar"
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

            {/* <FollowButton primary>Following</FollowButton> */}
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
                <strong>{tweet.retweets.length} </strong> Retweet
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
                  onClick={() => alert('Retweet')}
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

  const {
    auth,
    tweet: { tweet, loading },
    errors,
    getTweetById,
    removeTweet,
    likeTweet,
    history
  } = props;

  useEffect(() => {
    if (!tweet && loading === false) {
      getTweetById(status_id);
    }
  }, [status_id]);

  if (loading || !tweet) {
    return <Loading />;
  }

  const back = e => {
    if (e.target !== containerRef.current) {
      return;
    }
    props.history.goBack();
  };

  const handleActionClick = (e, action, tweet_id) => {
    e.stopPropagation();
    if (action === 'like') {
      likeTweet(tweet_id);
    } else if (action === 'remove') {
      removeTweet(tweet_id);
    }
  };

  const liked = !!(
    auth.user && tweet.likes.find(like => like.user === auth.user._id)
  );

  return (
    <TweetModal
      containerRef={containerRef}
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
  errors: PropTypes.object.isRequired,
  getTweetById: PropTypes.func.isRequired,
  removeTweet: PropTypes.func.isRequired,
  likeTweet: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  tweet: state.tweet,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getTweetById, removeTweet, likeTweet }
)(withRouter(TweetModalContainer));
