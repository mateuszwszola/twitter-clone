import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import portretPlaceholder from 'img/portret-placeholder.png';
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
    TweetAction,
    LikeTweetAction
} from './style';
import { UserAvatar, CloseButton } from 'shared/components';
import Comment from '../Comment';

function TweetModal({
                        back,
                        containerRef,
                        closeButtonRef,
                        tweet,
                        liked,
                        handleActionClick
                    }) {
    return createPortal(
        <Container onClick={back} ref={containerRef}>
            <CloseButton ref={closeButtonRef} />
            <StyledTweet>
                <Main>
                    <TopFlex>
                        <UserGroup>
                            <Link to={`/${tweet.user.username}`}>
                                <UserAvatar
                                    small
                                    src={tweet.user.avatar || portretPlaceholder}
                                    alt={`${tweet.user.name} avatar`}
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
                            <LikeTweetAction
                                onClick={e => handleActionClick(e, 'like', tweet._id)}
                            >
                                <LikeIcon className="far fa-heart" liked={liked} />{' '}
                                <strong>{tweet.likes.length}</strong>
                            </LikeTweetAction>
                        </TweetActionGroup>
                    </TweetContent>
                </Main>

                <Comment tweetId={tweet._id} />
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

export default TweetModal;
