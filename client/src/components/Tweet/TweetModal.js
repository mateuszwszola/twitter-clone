import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { getTweetById } from 'actions/tweetActions';
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
  CloseButton,
  TweetDate,
  UserGroup,
  UserInfo,
  SocialGroup,
  TweetActionGroup,
  FollowButton,
  TweetAction
} from './style';
import { UserAvatar } from 'shared/components';
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

function TweetModal({ back, containerRef, tweet }) {
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
              13/07/2019
              {/* <Moment format="DD/MM/YYYY" withTitle>
                {tweet.created}
              </Moment> */}
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
              <TweetAction>
                <Icon className="far fa-heart" onClick={() => alert('Like')} />{' '}
                <strong>{tweet.likes.length}</strong>
              </TweetAction>
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
  tweet: PropTypes.object.isRequired
};

function TweetModalContainer(props) {
  const { status_id } = props.match.params;
  const containerRef = useRef(null);

  const {
    tweet: { tweet, loading },
    errors,
    getTweetById,
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

  return <TweetModal containerRef={containerRef} back={back} tweet={tweet} />;
}

TweetModalContainer.propTypes = {
  tweet: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getTweetById: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  tweet: state.tweet,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getTweetById }
)(withRouter(TweetModalContainer));
