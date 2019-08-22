import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { withRouter } from 'react-router-dom';
import { UserAvatar } from 'shared/components';
import { connect } from 'react-redux';
import { setCurrentTweet, likeTweet, removeTweet } from 'actions/tweetActions';
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
  InfoText,
  DeleteButton
} from './style';
import portretPlaceholder from 'img/portret-placeholder.png';

function TweetsBoard(props) {
  const {
    tweets,
    setCurrentTweet,
    likeTweet,
    removeTweet,
    comments,
    auth
  } = props;
  if (tweets.length === 0) {
    return (
      <Container>
        {comments ? (
          <InfoText>Tweet does not have any comments</InfoText>
        ) : (
          <InfoText>You don't have any tweets</InfoText>
        )}
      </Container>
    );
  }

  const handleTweetClick = tweet => {
    const { user, _id } = tweet;
    setCurrentTweet(tweet);
    props.history.push({
      pathname: `/${user.username}/status/${_id}`,
      state: { modal: true }
    });
  };

  const handleActionClick = (e, action, tweet_id) => {
    e.stopPropagation();
    if (auth.isAuthenticated) {
      if (action === 'like') {
        likeTweet(tweet_id, auth.user._id);
      } else if (action === 'remove') {
        removeTweet(tweet_id);
      }
    } else {
      props.history.push({
        pathname: '/signin'
      });
    }
  };

  return (
    <Container>
      <Board>
        <HeaderWrapper>
          <Header>Tweets</Header>
        </HeaderWrapper>
        <List>
          {tweets.length > 0
            ? tweets.map(tweet => {
                const owner = auth.user && auth.user._id === tweet.user._id;
                const liked = !!(
                  auth.user &&
                  tweet.likes.find(like => like.user === auth.user._id)
                );
                return (
                  <ListItem
                    key={tweet._id}
                    onClick={() => handleTweetClick(tweet)}
                  >
                    <UserAvatar
                      small
                      src={tweet.user.avatar || portretPlaceholder}
                      alt="User Avatar"
                    />
                    <ListItemContent>
                      <TweetUserGroup>
                        <ItemGroup>
                          <TweetUserName>{tweet.user.name}</TweetUserName>
                        </ItemGroup>
                        <ItemGroup>
                          @
                          <TweetUserUsername>
                            {tweet.user.username}
                          </TweetUserUsername>
                        </ItemGroup>
                        <ItemGroup>
                          <Moment format="DD/MM/YYYY" withTitle>
                            {tweet.created}
                          </Moment>
                        </ItemGroup>
                      </TweetUserGroup>
                      <div>
                        <TweetText>{tweet.text}</TweetText>
                      </div>
                      <TweetBottomGroup>
                        <ItemGroup>
                          <Icon className="far fa-comment" />{' '}
                          {tweet.comments.length}
                        </ItemGroup>
                        <ItemGroup>
                          <Icon className="fas fa-retweet" />{' '}
                          {tweet.retweets.length}
                        </ItemGroup>
                        <LikeItemGroup
                          onClick={e => handleActionClick(e, 'like', tweet._id)}
                        >
                          <LikeIcon className="far fa-heart" liked={liked} />{' '}
                          {tweet.likes.length}
                        </LikeItemGroup>
                      </TweetBottomGroup>
                    </ListItemContent>

                    {owner ? (
                      <DeleteButton
                        onClick={e => handleActionClick(e, 'remove', tweet._id)}
                      >
                        Delete
                      </DeleteButton>
                    ) : null}
                  </ListItem>
                );
              })
            : ''}
        </List>
      </Board>
    </Container>
  );
}

TweetsBoard.propTypes = {
  tweets: PropTypes.array.isRequired,
  setCurrentTweet: PropTypes.func.isRequired,
  likeTweet: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { setCurrentTweet, likeTweet, removeTweet }
)(withRouter(TweetsBoard));
