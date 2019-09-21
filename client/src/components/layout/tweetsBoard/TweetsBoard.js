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
    TweetUserUsername,
    Icon,
    LikeIcon,
    ItemGroup,
    LikeItemGroup,
    InfoText,
    DeleteButton
} from './style';
import portretPlaceholder from 'img/portret-placeholder.png';

function TweetsBoard({
    tweets,
    auth,
    handleTweetClick,
    handleActionClick
                     }) {
    if (!tweets || tweets.length === 0) {
        return (
            <Container>
                <InfoText>There are no tweets to display</InfoText>
            </Container>
        );
    }

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
                                tweet.likes.find(userId => userId === auth.user._id)
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
    auth: PropTypes.object.isRequired,
    handleActionClick: PropTypes.func.isRequired,
    handleTweetClick: PropTypes.func.isRequired,
};

export default TweetsBoard;
