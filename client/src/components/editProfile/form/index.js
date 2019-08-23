import React from 'react';
import PropTypes from 'prop-types';
import { Input, FeedbackMessage } from 'shared/components';
import {
  StyledForm,
  Label,
  InputGroup,
  ButtonGroup,
  SaveButton,
  CancelButton
} from './style';

function getBirthdayDate(birthday) {
  if (!birthday) {
    return '';
  }
  const prependWithZero = number => (number < 10 ? '0' + number : number);
  const date = new Date(birthday);
  const year = date.getFullYear();
  const month = prependWithZero(date.getMonth() + 1);
  const day = prependWithZero(date.getDate());
  return `${year}-${month}-${day}`;
}

function Form({
  name,
  username,
  bio,
  location,
  website,
  birthday,
  avatar,
  backgroundPicture,
  handleSubmit,
  errors,
  history
}) {
  const back = e => {
    e.stopPropagation();
    history.goBack();
  };
  return (
    <StyledForm onSubmit={handleSubmit}>
      <InputGroup>
        <Label htmlFor="name">Name:</Label>
        <Input
          type="text"
          name="name"
          {...name}
          error={!!errors.name}
        />
        {errors.name && <FeedbackMessage>{errors.name}</FeedbackMessage>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="username">Username:</Label>
        <Input
          type="text"
          name="username"
          {...username}
          error={!!errors.username}
        />
        {errors.username && (
          <FeedbackMessage>{errors.username}</FeedbackMessage>
        )}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="bio">Bio:</Label>
        <Input
          type="text"
          name="bio"
          {...bio}
          error={!!errors.bio}
        />
        {errors.bio && <FeedbackMessage>{errors.bio}</FeedbackMessage>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="location">Location:</Label>
        <Input
          type="text"
          name="location"
          {...location}
          error={!!errors.location}
        />
        {errors.location && (
          <FeedbackMessage>{errors.location}</FeedbackMessage>
        )}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="website">Website:</Label>
        <Input
          type="text"
          name="website"
          {...website}
          error={!!errors.website}
        />
        {errors.website && <FeedbackMessage>{errors.website}</FeedbackMessage>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="birthday">Birthday:</Label>
        <Input
          type="date"
          name="birthday"
          {...birthday}
          error={!!errors.birthday}
        />
        {errors.birthday && (
          <FeedbackMessage>{errors.birthday}</FeedbackMessage>
        )}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="avatar">Avatar (URL):</Label>
        <Input
          type="text"
          name="avatar"
          {...avatar}
          error={!!errors.avatar}
        />
        {errors.avatar && <FeedbackMessage>{errors.avatar}</FeedbackMessage>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="backgroundPicture">Background picture (URL):</Label>
        <Input
          type="text"
          name="backgroundPicture"
          {...backgroundPicture}
          error={!!errors.backgroundPicture}
        />
        {errors.backgroundPicture && (
          <FeedbackMessage>{errors.backgroundPicture}</FeedbackMessage>
        )}
      </InputGroup>

      <ButtonGroup>
        <SaveButton type="submit">Update Changes</SaveButton>
        <CancelButton type="button" onClick={back}>
          Go Back
        </CancelButton>
      </ButtonGroup>
    </StyledForm>
  );
}

Form.propTypes = {
  name: PropTypes.object.isRequired,
  username: PropTypes.object.isRequired,
  bio: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  website: PropTypes.object.isRequired,
  birthday: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default Form;
