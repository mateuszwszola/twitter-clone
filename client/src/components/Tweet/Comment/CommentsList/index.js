import React from 'react';
import PropTypes from 'prop-types';
import Moment from "react-moment";
import { UserAvatar } from "shared/components";
import portretPlaceholder from "img/portret-placeholder.png";
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
    LikeIcon
} from './style';
import { CloseButton } from "shared/components";

function SingleComment({ comment }) {
    const user = {
        name: (comment.user && comment.user.name) || 'Unknown',
        username: (comment.user && comment.user.username) || 'Unknown',
        avatar: (comment.user && comment.user.avatar) || portretPlaceholder
    };
    return (
        <ListItem>
            <UserAvatar
                small
                src={user.avatar}
                alt={`${user.name} avatar`}
            />
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
                        onClick={e => console.log('Like')}
                    >
                        <LikeIcon className="far fa-heart" liked={false} />{' '}
                        {comment.likes.length}
                    </LikeItemGroup>
                </CommentBottomGroup>
            </ListItemContent>
        </ListItem>
    );
}

SingleComment.propTypes = {
    comment: PropTypes.object.isRequired,
};

function CommentsList({ comments, auth }) {
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
                {comments.map(comment => (
                    <SingleComment
                        key={comment._id}
                        comment={comment}
                    />
                ))}
            </List>
        </Container>
    )
}

CommentsList.propTypes = {
    comments: PropTypes.array.isRequired,
    auth: PropTypes.object.isRequired,
};

export default CommentsList;