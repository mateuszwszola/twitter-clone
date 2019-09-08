import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, FlexContainer, TextContainer, StyledName, StyledUsername } from './style';
import { UserAvatar } from 'shared/components';
import portretPlaceholder from 'img/portret-placeholder.png';

function ProfilePreview({ profile }) {
  return (
    <Container>
      <Link to={`/${profile.user.username}`}>
          <FlexContainer>
              <UserAvatar
                src={profile.user.avatar || portretPlaceholder}
                alt={`${profile.user.name} avatar`}
                tiny
              />
              <TextContainer>
                  <StyledName>{profile.user.name}</StyledName>
                  <StyledUsername>@{profile.user.username}</StyledUsername>
                  {profile.bio && <p>{profile.bio}</p>}
              </TextContainer>
          </FlexContainer>
      </Link>
    </Container>
  );
}

ProfilePreview.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfilePreview;
