import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteAccount } from 'actions/authActions';
import SettingsPage from 'components/SettingsPage';
import useFormInput from 'hooks/useFormInput';

function SettingsContainer({ deleteAccount }) {
  const password = useFormInput('');
  const password2 = useFormInput('');

  function handlePasswordFormSubmit(e) {
    e.preventDefault();
    console.log('The form has been submitted!');
  }

  return (
    <SettingsPage
      password={password}
      password2={password2}
      deleteAccount={deleteAccount}
      handlePasswordFormSubmit={handlePasswordFormSubmit}
    />
  );
}

SettingsContainer.propTypes = {
  deleteAccount: PropTypes.func.isRequired,
};

export default connect(null, { deleteAccount })(SettingsContainer);
