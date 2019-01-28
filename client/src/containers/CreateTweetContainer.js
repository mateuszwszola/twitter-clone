import React, { Component } from 'react';
import { createTweet } from '../utils/api';
import CreateTweet from '../components/CreateTweet';

class CreateTweetContainer extends Component {
  state = {
    text: '',
    errors: {}
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState(() => ({
      [name]: value
    }));
  };

  handleErrors = errors => {
    this.setState(() => ({ errors }));
  };

  handleSubmit = e => {
    e.preventDefault();
    const { text } = this.state;
    if (text.length < 2 || text.length > 140) {
      return this.setState(() => ({
        errors: {
          text: 'Tweet text length must be between 2 and 140 characters'
        }
      }));
    }
    const tweet = {
      text: this.state.text
    };

    createTweet(tweet, this.handleErrors);
  };

  render() {
    const { text, errors } = this.state;

    return (
      <CreateTweet
        text={text}
        errors={errors}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

export default CreateTweetContainer;
