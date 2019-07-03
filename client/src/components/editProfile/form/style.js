import styled from 'styled-components/macro';
import { queries } from 'shared/layout';
import { Button } from 'shared/components';

export const StyledForm = styled.form`
  width: 80%;
  max-width: 500px;
  margin: 0 auto;

  ${[queries.tiny]} {
    width: 100%;
  }
`;

export const InputGroup = styled.div`
  margin-top: 15px;
`;

export const Label = styled.label`
  font-size: 1.25rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
`;

export const SaveButton = styled(Button)`
  background-color: ${props => props.theme.colors.green};
  color: white;
  border-radius: 5px;
`;

export const CancelButton = styled(Button)`
  background-color: ${props => props.theme.colors.red};
  color: white;
  border-radius: 5px;
`;
