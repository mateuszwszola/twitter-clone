import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading';
import TextareaGroup from '../UI/TextareaGroup';
import {
  Wrapper,
  Modal,
  Header,
  Title,
  CloseButton,
  Box,
  AvatarWrapper,
  Avatar,
  Content,
  Form,
  Textarea,
  Button
} from './style';

function CreateTweet({ text, errors, handleChange, handleSubmit, loading }) {
  if (loading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <Modal>
        <Header>
          <Title>Compose new Tweet</Title>
          <CloseButton
            as="i"
            className="fas fa-times"
            onClick={() => alert('Close modal')}
          />
        </Header>
        <Box>
          <AvatarWrapper>
            <Avatar
              as="i"
              className="fas fa-user-circle"
              onClick={() => alert('Avatar clicked')}
            />
          </AvatarWrapper>

          <Content>
            <Form onSubmit={handleSubmit}>
              <TextareaGroup
                textarea={Textarea}
                text={text}
                handleChange={handleChange}
                placeholder="What's happening?"
                error={errors.text ? true : false}
                errorMsg={errors.text ? errors.text : ''}
              />
              <Button primary type="submit" disabled={!text}>
                Tweet
              </Button>
            </Form>
          </Content>
        </Box>
      </Modal>
    </Wrapper>
  );
}

CreateTweet.propTypes = {
  text: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

export default CreateTweet;
