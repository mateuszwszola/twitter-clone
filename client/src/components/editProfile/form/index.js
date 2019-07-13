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
  handleChange,
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
          value={name}
          onChange={handleChange}
          error={!!errors.name}
        />
        {errors.name && <FeedbackMessage>{errors.name}</FeedbackMessage>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="username">Username:</Label>
        <Input
          type="text"
          name="username"
          value={username}
          onChange={handleChange}
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
          value={bio}
          onChange={handleChange}
          error={!!errors.bio}
        />
        {errors.bio && <FeedbackMessage>{errors.bio}</FeedbackMessage>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="location">Location:</Label>
        <Input
          type="text"
          name="location"
          value={location}
          onChange={handleChange}
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
          value={website}
          onChange={handleChange}
          error={!!errors.website}
        />
        {errors.website && <FeedbackMessage>{errors.website}</FeedbackMessage>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="birthday">Birthday:</Label>
        <Input
          type="date"
          name="birthday"
          value={getBirthdayDate(birthday)}
          onChange={handleChange}
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
          value={avatar}
          onChange={handleChange}
          error={!!errors.avatar}
        />
        {errors.avatar && <FeedbackMessage>{errors.avatar}</FeedbackMessage>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="backgroundPicture">Background picture (URL):</Label>
        <Input
          type="text"
          name="backgroundPicture"
          value={backgroundPicture}
          onChange={handleChange}
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
  name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  website: PropTypes.string.isRequired,
  birthday: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default Form;
