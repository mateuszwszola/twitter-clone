import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import CreateTweetModal from '../components/createTweetModal';
import { connect } from 'react-redux';
import { createTweet } from '../actions/tweetActions';
import { closeCreateTweetModal } from '../actions/uiActions';

const CreateTweetContainer = ({
  showCreateTweetModal,
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
  });

  const closeModal = e => {
    if (wrapperRef !== null) {
      return false;
    }
    if (e.target === this.wrapperRef.current) {
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
    if (!validateTweet(tweet)) {
      return false;
    }

    createTweet(tweet);
  };

  const handleTextareaEnterPress = e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      handleSubmit(e);
    }
  };

  if (!showCreateTweetModal) {
    return null;
  }

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

// class CreateTweetContainer extends Component {
//   state = {
//     text: '',
//     errors: {}
//   };

//   wrapperRef = React.createRef();

//   componentDidMount() {
//     document.addEventListener('click', this.closeModal);
//   }

//   componentWillUnmount() {
//     document.removeEventListener('click', this.closeModal);
//   }

//   closeModal = e => {
//     if (e.target === this.wrapperRef.current) {
//       this.props.closeCreateTweetModal();
//     }
//   };

//   handleChange = e => {
//     const { value } = e.target;
//     this.setState(() => ({
//       text: value
//     }));
//   };

//   handleErrors = errors => {
//     this.setState(() => ({ errors }));
//   };

//   validateTweet = tweet => {
//     const { text } = tweet;
//     if (text.length < 2 || text.length > 140) {
//       this.handleErrors({
//         errors: {
//           text: 'Tweet text length must be between 2 and 140 characters'
//         }
//       });

//       return false;
//     }

//     return true;
//   };

//   handleSubmit = e => {
//     e.preventDefault();
//     const tweet = {
//       text: this.state.text
//     };

//     if (!this.validateTweet(tweet)) {
//       return false;
//     }

//     this.props.createTweet(tweet);
//   };

//   handleTextareaEnterPress = e => {
//     if (e.keyCode === 13 && e.shiftKey === false) {
//       this.handleSubmit(e);
//     }
//   };

//   render() {
//     const { text, errors } = this.state;
//     const { showCreateTweetModal, closeCreateTweetModal, loading } = this.props;

//     if (!showCreateTweetModal) {
//       return null;
//     }

//     return (
//       <CreateTweetModal
//         text={text}
//         errors={errors}
//         loading={loading}
//         handleChange={this.handleChange}
//         handleSubmit={this.handleSubmit}
//         handleTextareaEnterPress={this.handleTextareaEnterPress}
//         handleCloseModal={closeCreateTweetModal}
//         wrapperRef={this.wrapperRef}
//       />
//     );
//   }
// }

CreateTweetContainer.propTypes = {
  showCreateTweetModal: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  closeCreateTweetModal: PropTypes.func.isRequired,
  createTweet: PropTypes.func.isRequired
};

const mapStateToProps = ({ UI, tweet }) => ({
  showCreateTweetModal: UI.showCreateTweetModal,
  loading: tweet.loading
});

export default connect(
  mapStateToProps,
  { closeCreateTweetModal, createTweet }
)(CreateTweetContainer);
