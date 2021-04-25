import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Container,
  FlexContainer,
  TextContainer,
  StyledName,
  StyledUsername,
} from './style';
import { UserAvatar } from 'shared/components';
import portraitPlaceholder from 'img/portrait-placeholder.png';

function ProfileCard({ profile }) {
  const {
    user: { _id: userId, name, username, avatar },
    bio,
  } = profile;

  return (
    <Container>
      <Link to={`/profile/${userId}`}>
        <FlexContainer>
          <UserAvatar
            src={avatar || portraitPlaceholder}
            alt={`${name}'s avatar`}
            tiny
          />
          <TextContainer>
            <StyledName>{name}</StyledName>
            <StyledUsername>@{username}</StyledUsername>
            {bio && <p>{bio}</p>}
          </TextContainer>
        </FlexContainer>
      </Link>
    </Container>
  );
}

ProfileCard.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileCard;
