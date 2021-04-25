import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { UserAvatar } from 'shared/components';
import portraitPlaceholder from 'img/portrait-placeholder.png';
import {
  Container,
  Header,
  Heading,
  List,
  ListItem,
  ListItemContent,
  UserInfoGroup,
  ItemGroup,
  InfoText,
  CommentUserName,
  CommentUserUsername,
  CommentText,
  CommentBottomGroup,
  LikeItemGroup,
  LikeIcon,
} from './style';
import { DeleteButton } from './style';
import Loading from 'components/Loading';

function SingleComment({ comment, handleActionClick, auth }) {
  const user = {
    name: (comment.user && comment.user.name) || 'Unknown',
    username: (comment.user && comment.user.username) || 'Unknown',
    avatar: (comment.user && comment.user.avatar) || portraitPlaceholder,
  };

  const liked = !!(
    auth.user && comment.likes.find((userId) => userId === auth.user._id)
  );
  const owner = auth.user && auth.user._id === comment.user._id;

  return (
    <ListItem>
      <UserAvatar small src={user.avatar} alt={`${user.name} avatar`} />

      <ListItemContent>
        <UserInfoGroup>
          <ItemGroup>
            <CommentUserName>{user.name}</CommentUserName>
          </ItemGroup>
          <ItemGroup>
            <CommentUserUsername>{user.username}</CommentUserUsername>
          </ItemGroup>
          <ItemGroup>
            <Moment format="DD/MM/YYYY" withTitle>
              {comment.created}
            </Moment>
          </ItemGroup>
        </UserInfoGroup>
        <div>
          <CommentText>{comment.text}</CommentText>
        </div>
        <CommentBottomGroup>
          <LikeItemGroup
            onClick={(e) => handleActionClick(e, 'like', comment._id)}
          >
            <LikeIcon className="far fa-heart" liked={liked} />{' '}
            {comment.likes.length}
          </LikeItemGroup>
        </CommentBottomGroup>
      </ListItemContent>
      {owner ? (
        <DeleteButton
          onClick={(e) => handleActionClick(e, 'remove', comment._id)}
        >
          Delete
        </DeleteButton>
      ) : null}
    </ListItem>
  );
}

SingleComment.propTypes = {
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  handleActionClick: PropTypes.func.isRequired,
};

function CommentsList({ comments, loading, auth, handleActionClick }) {
  if (!comments || comments.length === 0) {
    return (
      <div>
        <InfoText>Tweet does not have any comments</InfoText>
      </div>
    );
  }

  return (
    <Container>
      <Header>
        <Heading>Comments</Heading>
      </Header>
      <List>
        {loading ? (
          <Loading />
        ) : (
          <>
            {comments.map((comment) => (
              <SingleComment
                key={comment._id}
                comment={comment}
                auth={auth}
                handleActionClick={handleActionClick}
              />
            ))}
          </>
        )}
      </List>
    </Container>
  );
}

CommentsList.propTypes = {
  comments: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  auth: PropTypes.object.isRequired,
  handleActionClick: PropTypes.func.isRequired,
};

export default CommentsList;
