import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import '@reach/dialog/styles.css';
import {
  Header,
  Title,
  CloseButton,
  Content,
  Form,
  Textarea,
  Button,
} from './style';
import TextareaGroup from 'components/TextareaGroup';
import { useCreateTweet } from 'utils/tweets';

export function CreateTweetModal() {
  const history = useHistory();

  function close() {
    if (history.length > 1) {
      history.goBack();
    } else {
      history.push('/');
    }
  }

  return (
    <DialogOverlay onDismiss={close}>
      <DialogContent aria-label="Compose new tweet">
        <Header>
          <Title>Compose new Tweet</Title>
          <CloseButton as="i" className="fas fa-times" onClick={close} />
        </Header>
        <Content>
          <CreateTweetForm onCreate={close} />
        </Content>
      </DialogContent>
    </DialogOverlay>
  );
}

function CreateTweetForm({ onCreate }) {
  const [text, setText] = useState('');
  const [errors, setErrors] = useState({});
  const createTweetMutation = useCreateTweet();

  function handleChange(e) {
    setText(e.target.value);
  }

  function validateTweet(tweet) {
    if (tweet.text.length < 1 || tweet.text.length > 280) {
      setErrors({
        message: 'Tweet text length must be between 1 and 280 characters',
      });
      return false;
    }
    return true;
  }

  function addTweet(e) {
    e && e.preventDefault();

    const tweet = { text };

    if (validateTweet(tweet)) {
      createTweetMutation.mutate(tweet, {
        onSuccess: () => {
          onCreate();
        },
        onError: (err) => {
          setErrors(
            err.response?.data || { message: 'An error has occurred!' }
          );
        },
      });
    }
  }

  function handleEnterPress(e) {
    e.preventDefault();
    if (e.keyCode === 13 && e.shiftKey === false) {
      addTweet();
    }
  }

  return (
    <Form onSubmit={addTweet}>
      <TextareaGroup
        textarea={Textarea}
        text={text}
        handleChange={handleChange}
        handleEnterPress={handleEnterPress}
        placeholder="What's happening?"
        error={Object.keys(errors).length > 0}
        errorMsg={errors.message || ''}
      />
      <Button
        primary
        type="submit"
        disabled={
          text.length < 1 || text.length > 280 || createTweetMutation.isLoading
        }
      >
        {createTweetMutation.isLoading ? 'Loading...' : 'Tweet'}
      </Button>
    </Form>
  );
}

CreateTweetForm.propTypes = {
  onCreate: PropTypes.func.isRequired,
};

export default CreateTweetForm;
