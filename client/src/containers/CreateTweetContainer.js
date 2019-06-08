import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createTweet } from '../utils/api';
import CreateTweetModal from '../components/createTweetModal';
import { connect } from 'react-redux';
import { closeCreateTweetModal } from '../actions/uiActions';
import {
  getTweetsByUserId,
  getProfileHomepageTweets
} from '../actions/tweetActions';

class CreateTweetContainer extends Component {
  state = {
    text: '',
    errors: {},
    loading: false
  };

  wrapperRef = React.createRef();

  componentDidMount() {
    document.addEventListener('click', this.closeModal);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeModal);
  }

  closeModal = e => {
    if (e.target === this.wrapperRef.current) {
      this.props.closeCreateTweetModal();
    }
  };

  handleChange = e => {
    const { value } = e.target;
    this.setState(() => ({
      text: value
    }));
  };

  handleErrors = errors => {
    this.setState(() => ({ errors, loading: false }));
  };

  validateTweet = tweet => {
    const { text } = tweet;
    if (text.length < 2 || text.length > 140) {
      this.setState(() => ({
        errors: {
          text: 'Tweet text length must be between 2 and 140 characters'
        }
      }));

      return false;
    }

    return true;
  };

  handleSubmit = e => {
    e.preventDefault();
    const tweet = {
      text: this.state.text
    };

    if (!this.validateTweet(tweet)) {
      return false;
    }

    this.setState(() => ({ loading: true }));

    createTweet(
      tweet,
      () => {
        this.setState(() => ({
          loading: false
        }));
        this.props.closeCreateTweetModal();
        this.props.showTempMessage('You have successfully created new Tweet!');
        window.location.reload();
      },
      this.handleErrors
    );
  };

  handleTextareaEnterPress = e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      this.handleSubmit(e);
    }
  };

  render() {
    const { text, errors, loading } = this.state;
    const { showCreateTweetModal, closeCreateTweetModal } = this.props;

    if (!showCreateTweetModal) {
      return null;
    }

    return (
      <CreateTweetModal
        text={text}
        errors={errors}
        loading={loading}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        handleTextareaEnterPress={this.handleTextareaEnterPress}
        handleCloseModal={closeCreateTweetModal}
        wrapperRef={this.wrapperRef}
      />
    );
  }
}

CreateTweetContainer.propTypes = {
  showCreateTweetModal: PropTypes.bool.isRequired,
  closeCreateTweetModal: PropTypes.func.isRequired,
  showTempMessage: PropTypes.func.isRequired,
  getTweetsByUserId: PropTypes.func.isRequired,
  getProfileHomepageTweets: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired
};

const mapStateToProps = ({ UI, auth }) => ({
  showCreateTweetModal: UI.showCreateTweetModal,
  userId: auth.user.id
});

export default connect(
  mapStateToProps,
  { closeCreateTweetModal, getTweetsByUserId, getProfileHomepageTweets }
)(CreateTweetContainer);
