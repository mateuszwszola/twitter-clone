import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createTweet } from 'actions/tweetActions';
import { closeCreateTweetModal } from 'actions/uiActions';
import CreateTweetModal from 'components/CreateTweetModal/Modal';

function CreateTweetContainer(props) {
  const {
    closeCreateTweetModal,
    createTweet,
    tweetLoading,
    profile,
    auth,
  } = props;

  const [text, setText] = useState('');
  const [errors, setErrors] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function closeModal(e) {
      if (wrapperRef !== null && e.target === wrapperRef.current) {
        closeCreateTweetModal();
      }
    }
    document.addEventListener('click', closeModal);
    return () => document.removeEventListener('click', closeModal);
  }, []);

  function handleChange(e) {
    setText(e.target.value);
  }

  function validateTweet(tweet) {
    if (tweet.text.length < 2 || tweet.text.length > 140) {
      setErrors([
        {
          msg: 'Tweet text length must be between 2 and 140 characters',
          param: 'tweet',
        },
      ]);
      return false;
    }
    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const tweet = { text };
    if (validateTweet(tweet)) {
      createTweet(tweet, addNewTweetToState());
    }
  }

  function handleEnterPress(e) {
    e.preventDefault();
    if (e.keyCode === 13 && e.shiftKey === false) {
      const tweet = { text };
      if (validateTweet(tweet)) {
        createTweet(tweet, addNewTweetToState());
      }
    }
  }

  function addNewTweetToState() {
    let addNewTweetToState = true;
    if (
      auth.user &&
      auth.user._id &&
      profile.user &&
      profile.user._id &&
      auth.user._id !== profile.user._id
    ) {
      addNewTweetToState = false;
    }
    return addNewTweetToState;
  }

  return (
    <CreateTweetModal
      text={text}
      errors={errors}
      loading={tweetLoading}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleEnterPress={handleEnterPress}
      handleCloseModal={closeCreateTweetModal}
      wrapperRef={wrapperRef}
    />
  );
}

CreateTweetContainer.propTypes = {
  tweetLoading: PropTypes.bool.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  closeCreateTweetModal: PropTypes.func.isRequired,
  createTweet: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  tweetLoading: state.tweet.loading,
  profile: state.profile.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { closeCreateTweetModal, createTweet })(
  CreateTweetContainer
);
