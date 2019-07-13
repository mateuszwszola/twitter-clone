import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Link, withRouter } from 'react-router-dom';
import { UserAvatar } from 'shared/components';
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
  ItemGroup
} from './style';
import portretPlaceholder from 'img/portret-placeholder.png';

function TweetsBoard(props) {
  const { tweets } = props;
  if (tweets.length === 0) {
    return (
      <Container>
        <p>You don't have any tweets</p>
      </Container>
    );
  }

  const handleTweetClick = (username, tweetId) => {
    props.history.push({
      pathname: `/${username}/status/${tweetId}`,
      state: { modal: true }
    });
  };

  return (
    <Container>
      <Board>
        <HeaderWrapper>
          <Header>Tweets</Header>
        </HeaderWrapper>
        <List>
          {tweets.length > 0
            ? tweets.map(tweet => (
                <ListItem
                  key={tweet._id}
                  onClick={() =>
                    handleTweetClick(tweet.user.username, tweet._id)
                  }
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
                      <ItemGroup>
                        <Icon className="far fa-heart" /> {tweet.likes.length}
                      </ItemGroup>
                    </TweetBottomGroup>
                  </ListItemContent>
                </ListItem>
              ))
            : ''}
        </List>
      </Board>
    </Container>
  );
}

TweetsBoard.propTypes = {
  tweets: PropTypes.array.isRequired
};

export default withRouter(TweetsBoard);
