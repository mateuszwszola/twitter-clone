import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CreateTweetContainer from 'containers/createTweetContainer';

const RenderCreateTweetModal = ({ isAuthenticated, showCreateTweetModal }) =>
  isAuthenticated && showCreateTweetModal && <CreateTweetContainer />;

RenderCreateTweetModal.propTypes = {
  showCreateTweetModal: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = ({ UI, auth }) => ({
  showCreateTweetModal: UI.showCreateTweetModal,
  isAuthenticated: auth.isAuthenticated
});

export default connect(mapStateToProps)(RenderCreateTweetModal);
