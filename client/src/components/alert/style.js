import styled from 'styled-components/macro';

export const StyledAlert = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${props =>
    props.type === 'success'
      ? props.theme.colors.green
      : props.theme.colors.red};
  color: white;
  border-radius: 3px;
  padding: 10px 15px;
`;
