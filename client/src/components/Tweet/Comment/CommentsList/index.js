import React from 'react';
import PropTypes from 'prop-types';
import Moment from "react-moment";
import { UserAvatar } from "shared/components";
import portretPlaceholder from "img/portret-placeholder.png";
import { Container, Header, Heading, List, ListItem, ListItemContent, UserInfoGroup, ItemGroup } from './style';

function SingleComment({ comment }) {
    const user = {
        username: (comment.user && comment.user.name) || 'Unknown',
        name: (comment.user && comment.user.name) || 'Unknown',
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
                        <span>{user.name}</span>
                    </ItemGroup>
                    <ItemGroup>
                        <span>{user.username}</span>
                    </ItemGroup>
                    <ItemGroup>
                        <Moment format="DD/MM/YYYY" withTitle>
                            {comment.created}
                        </Moment>
                    </ItemGroup>
                </UserInfoGroup>
            </ListItemContent>
            Comment
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
                <p>Tweet does not have any comments</p>
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