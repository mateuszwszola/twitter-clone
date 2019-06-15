import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import CreateTweetModal from '../components/createTweetModal/modal';
import { connect } from 'react-redux';
import { createTweet } from '../actions/tweetActions';
import { closeCreateTweetModal } from '../actions/uiActions';

const CreateTweetContainer = ({
  closeCreateTweetModal,
  createTweet,
  loading
}) => {
  const [text, setText] = useState('');
  const [errors, setErrors] = useState({});
  const wrapperRef = useRef(null);

  useEffect(() => {
    document.addEventListener('click', closeModal);
    return () => document.removeEventListener('click', closeModal);
  }, []);

  const closeModal = e => {
    if (wrapperRef === null) {
      return false;
    }
    if (e.target === wrapperRef.current) {
      closeCreateTweetModal();
    }
  };

  const handleChange = e => {
    const { value } = e.target;
    setText(value);
  };

  const validateTweet = tweet => {
    const { text } = tweet;
    if (text.length < 2 || text.length > 140) {
      setErrors({
        text: 'Tweet text length must be between 2 and 140 characters'
      });

      return false;
    }

    return true;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const tweet = { text };
    if (validateTweet(tweet)) {
      createTweet(tweet);
    }
  };

  const handleTextareaEnterPress = e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      const tweet = { text };
      if (validateTweet(tweet)) {
        createTweet(tweet);
      }
    }
  };

  return (
    <CreateTweetModal
      text={text}
      errors={errors}
      loading={loading}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleTextareaEnterPress={handleTextareaEnterPress}
      handleCloseModal={closeCreateTweetModal}
      wrapperRef={wrapperRef}
    />
  );
};

CreateTweetContainer.propTypes = {
  loading: PropTypes.bool.isRequired,
  closeCreateTweetModal: PropTypes.func.isRequired,
  createTweet: PropTypes.func.isRequired
};

const mapStateToProps = ({ tweet }) => ({
  loading: tweet.loading
});

export default connect(
  mapStateToProps,
  { closeCreateTweetModal, createTweet }
)(CreateTweetContainer);
