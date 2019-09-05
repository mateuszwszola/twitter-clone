import styled from 'styled-components/macro';
import { Button } from 'shared/components';

export const Container = styled.div`
  width: 50%;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
`;

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 20px;
`;

export const Form = styled.form`
  width: 100%;
  margin: 15px 0;
  padding: 10px 15px;
`;

export const ChangePasswordButton = styled(Button)`
`;

export const EditProfileButton = styled(Button)`
  border: 2px solid ${props => props.theme.colors.green};
  color: ${props => props.theme.colors.green};
  font-weight: bold;
  background-color: #fff;
`;

export const DeleteAccountButton = styled(Button)`
  border: 1px solid;
  background-color: ${props => props.theme.colors.red};
  color: #fff;
`;

