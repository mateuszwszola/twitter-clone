import React, { Component } from 'react';
import { createTweet } from '../utils/api';
import CreateTweetModal from '../components/createTweetModal/CreateTweetModal';
import { Redirect } from 'react-router-dom';

class CreateTweetContainer extends Component {
  state = {
    text: '',
    errors: {},
    loading: false
    // TODO: OPENING/CLOSING MODAL
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
        // TODO: close modal
        this.setState(() => ({
          loading: false
        }));
      },
      // TODO: Show errors and red styles, but do not close modal
      this.handleErrors
    );
  };

  render() {
    const { text, errors, redirectToReferrer, loading } = this.state;
    // const { from } = this.props.location.state || { from: { pathname: '/' } };

    // if (redirectToReferrer) {
    //   return <Redirect to={from} />;
    // }

    return (
      <CreateTweetModal
        text={text}
        errors={errors}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        loading={loading}
      />
    );
  }
}

export default CreateTweetContainer;
