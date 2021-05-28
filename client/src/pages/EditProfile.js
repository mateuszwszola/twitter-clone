import React from 'react';
import Loading from 'components/Loading';
import { useProfile } from 'utils/profiles';
import { useUser } from 'context/UserContext';
import { Container } from 'shared/layout';
import { Input, FeedbackMessage } from 'shared/components';
import {
  StyledForm,
  Label,
  InputGroup,
  ButtonGroup,
  SaveButton,
  CancelButton,
} from 'components/EditProfile/style';
import pickBy from 'lodash/pickBy';
import isEmpty from 'lodash/isEmpty';
import useForm from 'hooks/useForm';
import { useHistory } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import client from 'api/client';
import DisplayError from 'components/DisplayError';
import 'styled-components/macro';

function EditProfileContainer() {
  const user = useUser();
  const { isLoading, data: profile, error } = useProfile(user._id);
  const history = useHistory();
  const queryClient = useQueryClient();
  const { values, handleChange } = useForm({
    name: profile?.user?.name ?? '',
    avatar: profile?.user?.avatar ?? '',
    bio: profile?.bio ?? '',
    location: profile?.location ?? '',
    website: profile?.website ?? '',
    backgroundImage: profile?.backgroundImage ?? '',
  });
  const updateUserMutation = useMutation(
    (newUserData) => client.patch(`/users/${user._id}`, newUserData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users', user._id]);
      },
    }
  );
  const updateProfileMutation = useMutation(
    (newUserData) => client.patch(`/profiles/${user._id}`, newUserData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['profiles', user._id]);
      },
    }
  );

  async function handleSubmit(e) {
    e.preventDefault();
    const userFields = ['name', 'avatar'];
    const profileFields = ['bio', 'location', 'website', 'backgroundImage'];

    /* 
      Some values can be stored as null or undefined, so if they are 
      I make sure they default to empty string, same as the empty form values.

      For patch requests, pick only the values that user actually changed.
    */
    const newUserValues = pickBy(
      values,
      (value, key) =>
        userFields.includes(key) && value !== (profile.user[key] ?? '')
    );
    const newProfileValues = pickBy(
      values,
      (value, key) =>
        profileFields.includes(key) && value !== (profile[key] ?? '')
    );

    // Reset mutations state
    updateUserMutation.reset();
    updateProfileMutation.reset();

    if (!isEmpty(newUserValues)) {
      updateUserMutation.mutate(newUserValues);
    }

    if (!isEmpty(newProfileValues)) {
      updateProfileMutation.mutate(newProfileValues);
    }
  }

  if (error) {
    return <DisplayError error={error} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container>
      <div
        css={`
          text-align: center;
        `}
      >
        {updateUserMutation.isLoading || updateProfileMutation.isLoading ? (
          <p>Loading...</p>
        ) : updateUserMutation.isError || updateProfileMutation.isError ? (
          <>
            <FeedbackMessage>
              {updateUserMutation.error?.response?.data?.message}
            </FeedbackMessage>
            <FeedbackMessage>
              {updateProfileMutation.error?.response?.data?.message}
            </FeedbackMessage>
          </>
        ) : updateUserMutation.isSuccess || updateProfileMutation.isSuccess ? (
          <FeedbackMessage $isSuccess>
            Profile successfully updated!
          </FeedbackMessage>
        ) : (
          ''
        )}
      </div>
      <StyledForm onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="name">Name:</Label>
          <Input
            type="text"
            name="name"
            onChange={handleChange}
            value={values.name}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="bio">Bio:</Label>
          <Input
            type="text"
            name="bio"
            value={values.bio}
            onChange={handleChange}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="location">Location:</Label>
          <Input
            type="text"
            name="location"
            value={values.location}
            onChange={handleChange}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="website">Website:</Label>
          <Input
            type="text"
            name="website"
            value={values.website}
            onChange={handleChange}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="avatar">Avatar (URL):</Label>
          <Input
            type="text"
            name="avatar"
            value={values.avatar}
            onChange={handleChange}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="backgroundImage">Background image (URL):</Label>
          <Input
            type="text"
            name="backgroundImage"
            value={values.backgroundImage}
            onChange={handleChange}
          />
        </InputGroup>

        <ButtonGroup>
          <SaveButton
            disabled={
              updateUserMutation.isLoading || updateProfileMutation.isLoading
            }
            type="submit"
          >
            Update Profile
          </SaveButton>
          <CancelButton
            disabled={
              updateUserMutation.isLoading || updateProfileMutation.isLoading
            }
            type="button"
            onClick={() => history.goBack()}
          >
            Go Back
          </CancelButton>
        </ButtonGroup>
      </StyledForm>
    </Container>
  );
}

export default EditProfileContainer;
