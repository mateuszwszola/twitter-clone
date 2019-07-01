import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
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
  TweetUserUsername
} from './style';

const TweetsBoard = ({ tweets }) => (
  <Container>
    <Board>
      <HeaderWrapper>
        <Header>Tweets</Header>
      </HeaderWrapper>
      <List>
        {tweets.length > 0 ? (
          tweets.map(tweet => (
            <ListItem key={tweet._id}>
              <UserAvatar
                small
                src="https://picsum.photos/200"
                alt="User Avatar"
              />
              <ListItemContent>
                <TweetUserGroup>
                  <TweetUserName>{tweet.user.name}</TweetUserName>@
                  <TweetUserUsername>{tweet.user.username}</TweetUserUsername>
                  <Moment format="MMMM YYYY" withTitle>
                    {tweet.created}
                  </Moment>
                </TweetUserGroup>
                <div>
                  <TweetText>{tweet.text}</TweetText>
                </div>
                <TweetBottomGroup>
                  <span>
                    <i className="far fa-comment" /> {tweet.comments.length}
                  </span>
                  <span>
                    <i className="fas fa-retweet" /> {tweet.retweets.length}
                  </span>
                  <span>
                    <i className="far fa-heart" /> {tweet.likes.length}
                  </span>
                </TweetBottomGroup>
              </ListItemContent>
            </ListItem>
          ))
        ) : (
          <p className="no-tweets-info">None</p>
        )}
      </List>
    </Board>
  </Container>
);

TweetsBoard.propTypes = {
  tweets: PropTypes.array.isRequired
};

export default TweetsBoard;
