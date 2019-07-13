import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { getTweetById } from 'actions/tweetActions';
import { connect } from 'react-redux';
import Loading from '../Loading';
import portretPlaceholder from 'img/portret-placeholder.png';
import Moment from 'react-moment';
import {
  Container,
  ListItem,
  ListItemContent,
  TweetUserGroup,
  ItemGroup,
  TweetUserName,
  TweetUserUsername,
  TweetText,
  TweetBottomGroup,
  Icon,
  CommentContainer
} from './style';
import { UserAvatar } from 'shared/components';
import { Link } from 'react-router-dom';
import AddComment from './AddComment';

function TweetModal(props) {
  const { status_id } = props.match.params;
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
    e.stopPropagation();
    history.goBack();
  };

  return createPortal(
    <Container>
      <button onClick={back}>Close</button>
      <ListItem>
        <UserAvatar
          small
          src={tweet.user.avatar || portretPlaceholder}
          alt="User Avatar"
        />
        <ListItemContent>
          <TweetUserGroup>
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
              <Icon className="far fa-comment" /> {tweet.comments.length}
            </ItemGroup>
            <ItemGroup>
              <Icon className="fas fa-retweet" /> {tweet.retweets.length}
            </ItemGroup>
            <ItemGroup>
              <Icon className="far fa-heart" /> {tweet.likes.length}
            </ItemGroup>
          </TweetBottomGroup>

          <CommentContainer>
            <AddComment />
          </CommentContainer>
        </ListItemContent>
      </ListItem>
    </Container>,
    document.getElementById('root')
  );
}

TweetModal.propTypes = {
  tweet: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getTweetById: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  tweet: state.tweet,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getTweetById }
)(withRouter(TweetModal));
