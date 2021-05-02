import * as React from 'react';
import { Container } from 'shared/layout';
import { Button, FeedbackMessage, PrimaryHeading } from 'shared/components';
import 'styled-components/macro';
import {
  ActionsContainer,
  DeleteAccountButton,
  EditProfileButton,
} from 'components/Settings/style';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogLabel,
  AlertDialogDescription,
} from '@reach/alert-dialog';
import { useAuth } from 'context/AuthContext';
import { useMutation } from 'react-query';
import client from 'api/client';
import { useAlert } from 'context/AlertContext';

function SettingsPage() {
  const { user, logout } = useAuth();
  const [showDialog, setShowDialog] = React.useState(false);
  const cancelRef = React.useRef();
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);
  const { setAlert } = useAlert();
  const deleteAccountMutation = useMutation(
    () => client.delete(`/users/${user._id}`),
    {
      onSuccess: () => {
        logout();
        setAlert({ type: 'success', msg: 'Account successfully deleted!' });
      },
    }
  );

  return (
    <Container>
      <PrimaryHeading>Settings</PrimaryHeading>
      <FeedbackMessage>
        {deleteAccountMutation.error?.response?.data?.message}
      </FeedbackMessage>
      <ActionsContainer>
        <EditProfileButton as={Link} to="/edit-profile">
          Edit profile
        </EditProfileButton>
        <DeleteAccountButton onClick={open}>Delete Account</DeleteAccountButton>
      </ActionsContainer>

      {showDialog && (
        <AlertDialog leastDestructiveRef={cancelRef}>
          <AlertDialogLabel
            css={`
              font-size: 1.5rem;
            `}
          >
            Please Confirm!
          </AlertDialogLabel>
          <AlertDialogDescription
            css={`
              margin-top: 5px;
              font-size: 1.1rem;
            `}
          >
            Are you sure you want to delete your account? This action is
            permanent.
          </AlertDialogDescription>
          <div
            css={`
              margin-top: 15px;
            `}
          >
            <Button onClick={() => deleteAccountMutation.mutate()}>
              Yes, delete
            </Button>{' '}
            <Button ref={cancelRef} onClick={close}>
              Nevermind, don't delete.
            </Button>
          </div>
        </AlertDialog>
      )}
    </Container>
  );
}

export default SettingsPage;
