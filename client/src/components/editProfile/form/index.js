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

// function getBirthdayDate(birthday) {
// //   if (!birthday) {
// //     return '';
// //   }
// //   const prependWithZero = number => (number < 10 ? '0' + number : number);
// //   const date = new Date(birthday);
// //   const year = date.getFullYear();
// //   const month = prependWithZero(date.getMonth() + 1);
// //   const day = prependWithZero(date.getDate());
// //   return `${year}-${month}-${day}`;
// // }

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
    const findIfErrExists = (param) => {
        const error = errors.find(err => err.param === param);
        if (error) {
            return error.msg;
        } else {
            return error;
        }
    };
  return (
    <StyledForm onSubmit={handleSubmit}>
      <InputGroup>
        <Label htmlFor="name">Name:</Label>
        <Input
          type="text"
          name="name"
          {...name}
          error={!!(findIfErrExists('name'))}
        />
        {findIfErrExists('name') && <FeedbackMessage>{findIfErrExists('name')}</FeedbackMessage>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="username">Username:</Label>
        <Input
          type="text"
          name="username"
          {...username}
          error={!!(findIfErrExists('username'))}
        />
        {findIfErrExists('username') && (
          <FeedbackMessage>{findIfErrExists('username')}</FeedbackMessage>
        )}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="bio">Bio:</Label>
        <Input
          type="text"
          name="bio"
          {...bio}
          error={!!(findIfErrExists('bio'))}
        />
        {findIfErrExists('bio') && <FeedbackMessage>{findIfErrExists('bio')}</FeedbackMessage>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="location">Location:</Label>
        <Input
          type="text"
          name="location"
          {...location}
          error={!!(findIfErrExists('location'))}
        />
        {findIfErrExists('location') && (
          <FeedbackMessage>{findIfErrExists('location')}</FeedbackMessage>
        )}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="website">Website:</Label>
        <Input
          type="text"
          name="website"
          {...website}
          error={!!(findIfErrExists('website'))}
        />
        {findIfErrExists('website') && <FeedbackMessage>{findIfErrExists('website')}</FeedbackMessage>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="birthday">Birthday:</Label>
        <Input
          type="date"
          name="birthday"
          {...birthday}
          error={!!(findIfErrExists('birthday'))}
        />
        {findIfErrExists('birthday') && (
          <FeedbackMessage>{findIfErrExists('birthday')}</FeedbackMessage>
        )}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="avatar">Avatar (URL):</Label>
        <Input
          type="text"
          name="avatar"
          {...avatar}
          error={!!(findIfErrExists('avatar'))}
        />
        {findIfErrExists('avatar') && <FeedbackMessage>{findIfErrExists('avatar')}</FeedbackMessage>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="backgroundPicture">Background picture (URL):</Label>
        <Input
          type="text"
          name="backgroundPicture"
          {...backgroundPicture}
          error={!!(findIfErrExists('backgroundPicture'))}
        />
        {findIfErrExists('backgroundPicture') && (
          <FeedbackMessage>{findIfErrExists('backgroundPicture')}</FeedbackMessage>
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
  errors: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired
};

export default Form;
